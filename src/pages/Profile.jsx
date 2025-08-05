import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useActiveWallet, useProfiles } from 'thirdweb/react';
import Navbar from '../components/Navbar';
import StickyBar from '../components/StickyBar';
import Footer from '../components/Footer';
import { fetchUserSubscriptions } from '../store/slices/subscriptionSlice';
import { fetchAthletes } from '../store/slices/athleteSlice';
import { supabase } from '../lib/supabase';
import { userOwnsNFT, userOwnsNFTBalance } from '../utils/userOwnsNft';
import { subscriptionActions, validateSubscriptionAction } from '../utils/stripeSubscription';
import { client } from '../client';
import toast from 'react-hot-toast';
import {
  User,
  Crown,
  Calendar,
  MessageCircle,
  Pause,
  Play,
  Trash2,
  ExternalLink,
  Trophy,
  Clock,
  Hash,
  CreditCard
} from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const wallet = useActiveWallet();
  const address = wallet?.getAccount().address;
  const { data: profiles } = useProfiles({ client });
  const { userSubscriptions, loading: subscriptionsLoading } = useSelector(state => state.subscriptions);

  const { profile } = useSelector(state => state.user);
  const { athletes } = useSelector(state => state.athletes);
  const [userMessages, setUserMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [nftsLoading, setNftsLoading] = useState(false);
  const [userTransactions, setUserTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const userId = profiles?.[0]?.details?.id;
  const userEmail = profiles?.[0]?.details?.email;

  // Fetch user subscriptions
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserSubscriptions(userId));
    }
  }, [userId, dispatch]);
  useEffect(() => {
    dispatch(fetchAthletes());
  }, [dispatch]);
  // Fetch user messages
  useEffect(() => {
    const fetchUserMessages = async () => {
      if (!userId) return;

      setMessagesLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            Events (*, Atheletes (*))
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);
        if (error) throw error;
        setUserMessages(data || []);
      } catch (error) {
        console.error('Error fetching user messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setMessagesLoading(false);
      }
    };

    if (userId) {
      fetchUserMessages();
    }
  }, [userId]);

  // Check NFT ownership for all athletes
  useEffect(() => {
    const checkNFTOwnership = async () => {
      if (!address || !athletes?.length) return;

      setNftsLoading(true);
      try {
        const nftChecks = await Promise.all(
          athletes
            .filter(athlete => athlete.nftContractAddress)
            .map(async (athlete) => {
              const owns = await userOwnsNFTBalance(athlete.nftContractAddress, address);
              return owns.owns ? { ...athlete, balance: Number(owns.balance) } : null;
            })
        );

        setOwnedNFTs(nftChecks.filter(Boolean));
      } catch (error) {
        console.error('Error checking NFT ownership:', error);
        toast.error('Failed to load NFT data');
      } finally {
        setNftsLoading(false);
      }
    };

    if (address && athletes?.length) {
      checkNFTOwnership();
    }
  }, [address, athletes]);

  // Fetch user transactions
  useEffect(() => {
    const fetchUserTransactions = async () => {
      if (!userId) return;

      setTransactionsLoading(true);
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('userId', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Enhance transactions with athlete names
        const enhancedTransactions = data?.map(transaction => {
          const athlete = athletes?.find(a => a.nftContractAddress === transaction.contract_address);
          console.log(transaction.quantity);
          return {
            ...transaction,
            athleteName: athlete ? `${athlete.fanTokenSymbol}` : 'Subscription'
          };
        }) || [];
        
        setUserTransactions(enhancedTransactions);
      } catch (error) {
        console.error('Error fetching user transactions:', error);
        toast.error('Failed to load transactions');
      } finally {
        setTransactionsLoading(false);
      }
    };

    if (userId && athletes?.length) {
      fetchUserTransactions();
    }
  }, [userId, athletes]);

  const handleSubscriptionAction = async (subscription, action) => {
    try {
      // Validate action is allowed
      if (!validateSubscriptionAction(subscription, action)) {
        toast.error(`Cannot ${action} this subscription`);
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading(`${action === 'cancel' ? 'Cancelling' : action === 'pause' ? 'Pausing' : 'Resuming'} subscription...`);

      let result;
      switch (action) {
        case 'pause':
          console.log('Invoking pause subscription function...');
          result = await subscriptionActions.pauseSubscription(
            subscription.stripe_subscription_id
          );
          console.log('Pause subscription result:', result);
          break;
        case 'resume':
          console.log('Invoking resume subscription function...');
          result = await subscriptionActions.resumeSubscription(
            subscription.stripe_subscription_id
          );
          console.log('Resume subscription result:', result);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(`Subscription ${action}d successfully!`);

        // Refresh subscriptions from database
        console.log('Refreshing subscriptions from database...');
        if (userId) {
          await dispatch(fetchUserSubscriptions(userId));
          console.log('Subscriptions refreshed successfully');
        }
      } else {
        throw new Error('Action failed');
      }

    } catch (error) {
      console.error(`Error ${action}ing subscription:`, error);
      toast.error(`Failed to ${action} subscription`);
    }
  };

  const getAthleteById = (athleteId) => {
    return athletes?.find(athlete => athlete.id === athleteId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!address) {
    return (
      <div className='h-[100dvh] relative bg-gradient-to-r from-[#f8e3e0] to-[#e9d5f7]'>
        <Navbar />
        <div className="h-[calc(100dvh-145px)] min-[382px]:h-[calc(100dvh-175px)] sm:h-[calc(100dvh-196px)] flex flex-col items-center justify-center">
          <div className="text-center px-5">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
              <User size={64} className="mx-auto mb-4 text-[#9352ee]" />
              <h2 className="text-2xl font-bold text-[#1D1D1D] mb-4">Sign In or Sign Up</h2>
              <p className="text-[#717071] mb-6">Please log in or create an account to access your profile page.</p>
            </div>
          </div>
        </div>
        <div className="sticky w-full bottom-0 z-40">
          <StickyBar />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='h-[100dvh] relative'>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-[#f8e3e0] to-[#e9d5f7] py-4 sm:py-8 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className={profile?.profilePicture ? `w-16 h-16 sm:w-20 sm:h-20 bg-transparent rounded-full flex items-center justify-center` : `w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#e99289] to-[#9352ee] rounded-full flex items-center justify-center`}>
                {profile?.profilePicture ? (
                  <img src={profile?.profilePicture} alt="Profile" className="w-full h-full object-contain rounded-full" />
                ) : (
                  <User size={32} className="sm:size-10 text-white" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#e99289] to-[#9352ee] bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-[#717071] mt-1 text-sm sm:text-base">
                  {userEmail || 'Connected Wallet User'}
                </p>
                <p className="text-xs sm:text-sm text-[#717071] font-mono break-all">
                  {address}
                </p>
              </div>
              {/* client requirement to remove this section */}
              {/* <div className="text-center sm:text-right">
                <div className="text-xs sm:text-sm text-[#717071]">Active Subscriptions</div>
                <div className="text-xl sm:text-2xl font-bold text-[#9352ee]">
                  {userSubscriptions?.filter(sub => sub.active).length || 0}
                </div>
              </div> */}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg mb-4 sm:mb-8">
            <div className="flex items-center flex-wrap justify-center border-b border-gray-200 scrollbar-hide">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'nfts', label: 'NFTs', icon: Trophy },
                { id: 'subscriptions', label: 'Subscriptions', icon: Crown },
                { id: 'transactions', label: 'Transactions', icon: CreditCard },
                { id: 'messages', label: 'Messages', icon: MessageCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-1.5 sm:px-6 py-3 sm:py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === tab.id
                    ? 'text-[#9352ee] border-b-2 border-[#9352ee]'
                    : 'text-[#717071] hover:text-[#9352ee]'
                    }`}
                >
                  <tab.icon size={16} className="sm:size-5" />
                  <span className="inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-4 sm:space-y-8">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <Trophy className="text-[#e99289]" size={20} />
                    <h3 className="text-base sm:text-lg font-semibold text-[#1D1D1D]">NFTs Owned</h3>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#9352ee]">
                    {ownedNFTs.length}
                  </div>
                  <p className="text-[#717071] text-xs sm:text-sm mt-1">Athletes unlocked</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <Crown className="text-[#e99289]" size={20} />
                    <h3 className="text-base sm:text-lg font-semibold text-[#1D1D1D]">Subscriptions</h3>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#9352ee]">
                    {userSubscriptions?.length || 0}
                  </div>
                  <p className="text-[#717071] text-xs sm:text-sm mt-1">Total subscriptions</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <MessageCircle className="text-[#e99289]" size={20} />
                    <h3 className="text-base sm:text-lg font-semibold text-[#1D1D1D]">Messages</h3>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#9352ee]">
                    {userMessages.length}
                  </div>
                  <p className="text-[#717071] text-xs sm:text-sm mt-1">Recent messages</p>
                </div>
              </div>
            )}

            {activeTab === 'nfts' && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-4 sm:mb-6">Your NFT Collection</h3>
                {nftsLoading ? (
                  <div className="flex items-center justify-center py-8 sm:py-12">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-t-[#9352ee] border-r-[#e99289] border-b-[#9352ee] border-l-[#e99289] rounded-full animate-spin"></div>
                  </div>
                ) : ownedNFTs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {ownedNFTs.map((athlete) => (
                      <div key={athlete.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                        <img
                          src={athlete.profilePicture || '/default-athlete.png'}
                          alt={athlete.firstName}
                          className="w-full h-36 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                        />
                        <h4 className="font-semibold text-[#1D1D1D] mb-2 text-sm sm:text-base">{athlete.firstName} {athlete.lastName}</h4>
                        <p className="text-[#717071] text-xs sm:text-sm mb-3 line-clamp-2">{athlete.bio}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-gradient-to-r from-[#e99289] to-[#9352ee] text-white px-2 sm:px-3 py-1 rounded-full">
                            NFT Owned x {athlete.balance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Trophy size={40} className="sm:size-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                    <h4 className="text-base sm:text-lg font-medium text-[#717071] mb-2">No NFTs Found</h4>
                    <p className="text-[#717071] text-sm sm:text-base">You don't own any athlete NFTs yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-4 sm:mb-6">Your Subscriptions</h3>
                {subscriptionsLoading ? (
                  <div className="flex items-center justify-center py-8 sm:py-12">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-t-[#9352ee] border-r-[#e99289] border-b-[#9352ee] border-l-[#e99289] rounded-full animate-spin"></div>
                  </div>
                ) : userSubscriptions?.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {userSubscriptions.map((subscription) => {
                      const athlete = getAthleteById(subscription.athleteId);
                      return (
                        <div key={subscription.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <img
                                src={athlete?.profilePicture || '/default-athlete.png'}
                                alt={athlete?.firstName}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="font-semibold text-[#1D1D1D] text-sm sm:text-base">{athlete?.firstName} {athlete?.lastName}</h4>
                                <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#717071]">
                                  <Calendar size={12} />
                                  <span>Started {formatDate(subscription.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end space-x-3">
                              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${subscription.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                                }`}>
                                {subscription.active ? 'Active' : 'Inactive'}
                              </span>
                              <div className="flex space-x-1 sm:space-x-2">
                                {subscription.active ? (
                                  <button
                                    onClick={() => handleSubscriptionAction(subscription, 'pause')}
                                    className="p-1.5 sm:p-2 text-[#717071] hover:text-[#e99289] transition-colors"
                                    title="Pause subscription"
                                  >
                                    <Pause size={14} className="sm:size-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleSubscriptionAction(subscription, 'resume')}
                                    className="p-1.5 sm:p-2 text-[#717071] hover:text-[#9352ee] transition-colors"
                                    title="Resume subscription"
                                  >
                                    <Play size={14} className="sm:size-4" />
                                  </button>
                                )}
                                {/* <button
                                  onClick={() => handleSubscriptionAction(subscription, 'cancel')}
                                  className="p-1.5 sm:p-2 text-[#717071] hover:text-red-500 transition-colors"
                                  title="Cancel subscription"
                                >
                                  <Trash2 size={14} className="sm:size-4" />
                                </button> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Crown size={40} className="sm:size-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                    <h4 className="text-base sm:text-lg font-medium text-[#717071] mb-2">No Subscriptions</h4>
                    <p className="text-[#717071] text-sm sm:text-base">You don't have any subscriptions yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-4 sm:mb-6">Transaction History</h3>
                {transactionsLoading ? (
                  <div className="flex items-center justify-center py-8 sm:py-12">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-t-[#9352ee] border-r-[#e99289] border-b-[#9352ee] border-l-[#e99289] rounded-full animate-spin"></div>
                  </div>
                ) : userTransactions.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {userTransactions.map((transaction) => (
                      <div key={transaction.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#e99289] to-[#9352ee] rounded-full flex items-center justify-center">
                              <CreditCard size={16} className="sm:size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-[#1D1D1D] text-sm sm:text-base">
                                {transaction.athleteName}
                              </div>
                              {transaction.quantity ? (
                                <div className="text-xs text-[#717071]">
                                  Quantity: {transaction.quantity}
                                </div>
                              ) : <div className="text-xs text-[#717071]">
                              Per Month
                            </div>}
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end">
                            <div className="text-lg sm:text-xl font-bold text-[#9352ee]">
                              {(transaction.total_amount / 100).toFixed(2)} {transaction.currency || 'USD'}
                            </div>
                            <div className="text-xs text-[#717071] flex items-center space-x-1">
                              <Clock size={10} className="sm:size-3" />
                              <span>{formatDate(transaction.created_at)} at {formatTime(transaction.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        {transaction.status && (
                          <div className="flex justify-end items-center pt-2 border-t border-gray-100">
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                              transaction.status === 'succeeded' 
                                ? 'bg-green-100 text-green-700'
                                : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <CreditCard size={40} className="sm:size-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                    <h4 className="text-base sm:text-lg font-medium text-[#717071] mb-2">No Transactions</h4>
                    <p className="text-[#717071] text-sm sm:text-base">You haven't made any transactions yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-4 sm:mb-6">Recent Messages</h3>
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-8 sm:py-12">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-t-[#9352ee] border-r-[#e99289] border-b-[#9352ee] border-l-[#e99289] rounded-full animate-spin"></div>
                  </div>
                ) : userMessages.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {userMessages.map((message) => (
                      <div key={message.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-3">
                            <img
                              src={message.Events?.Atheletes?.profilePicture || '/default-athlete.png'}
                              alt={message.Events?.Atheletes?.firstName}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium text-[#1D1D1D] text-xs sm:text-sm">
                                {message.Events?.Atheletes?.firstName} {message.Events?.Atheletes?.lastName}
                              </div>
                              <div className="text-xs text-[#717071] line-clamp-1">
                                {message.Events?.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-[#717071] flex items-center space-x-1 sm:space-x-2">
                            <Clock size={10} className="sm:size-3" />
                            <span className="hidden sm:inline">{formatDate(message.created_at)} at {formatTime(message.created_at)}</span>
                            <span className="sm:hidden">{formatTime(message.created_at)}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                          <p className="text-[#1D1D1D] text-sm sm:text-base break-words">{message.content}</p>
                          {message.message_type !== 'text' && (
                            <div className="mt-2 text-xs text-[#717071] flex items-center space-x-1">
                              <Hash size={10} />
                              <span>{message.message_type}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <MessageCircle size={40} className="sm:size-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                    <h4 className="text-base sm:text-lg font-medium text-[#717071] mb-2">No Messages</h4>
                    <p className="text-[#717071] text-sm sm:text-base">You haven't sent any messages yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="sticky w-full bottom-0 z-40">
        <StickyBar />
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
