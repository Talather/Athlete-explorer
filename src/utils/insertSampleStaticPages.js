import { supabase } from '../lib/supabase';

// Sample data for each page type
const sampleData = {
  faq: {
    faqs: [
      {
        question: "What is Fansday?",
        answer: "Fansday is a platform that connects fans with their favorite athletes through exclusive events, contests, and interactive experiences."
      },
      {
        question: "How do I participate in events?",
        answer: "Simply select your favorite athlete from the homepage and browse their available events. You can participate in live streams, contests, and watch exclusive videos."
      },
      {
        question: "Are the events free to join?",
        answer: "Most events are free to join, but some premium events may require fan tokens or special access passes."
      },
      {
        question: "How do fan tokens work?",
        answer: "Fan tokens are digital assets that give you access to exclusive content and voting rights in athlete decisions. They can be earned through participation or purchased during Fan Token Offerings (FTOs)."
      },
      {
        question: "Can I interact with other fans during events?",
        answer: "Yes! Our live chat feature allows you to interact with other fans in real-time during events. You can send messages, share files, and reply to other fans' messages."
      }
    ]
  },
  
  terms: {
    sections: [
      {
        title: "1. Acceptance of Terms",
        content: [
          "By accessing and using Fansday, you accept and agree to be bound by the terms and provision of this agreement.",
          "If you do not agree to abide by the above, please do not use this service."
        ]
      },
      {
        title: "2. User Accounts",
        content: [
          "When you create an account with us, you must provide information that is accurate, complete, and current at all times.",
          "You are responsible for safeguarding the password and for all activities that occur under your account."
        ]
      },
      {
        title: "3. Fan Tokens",
        content: [
          "Fan tokens are digital assets that may have value and are subject to market forces.",
          "Participation in Fan Token Offerings (FTOs) involves financial risk, and you should carefully consider your financial situation before participating."
        ]
      },
      {
        title: "4. User Content",
        content: [
          "Users may upload content including but not limited to images, videos, and messages.",
          "You retain ownership of your content but grant Fansday a license to use, display, and distribute your content on the platform."
        ]
      },
      {
        title: "5. Prohibited Uses",
        items: [
          "Harassing, abusing, or harming other users",
          "Uploading inappropriate or offensive content",
          "Attempting to manipulate fan token prices",
          "Violating any applicable laws or regulations"
        ]
      },
      {
        title: "6. Limitation of Liability",
        content: [
          "Fansday shall not be liable for any indirect, incidental, special, consequential, or punitive damages.",
          "This includes damages for loss of profits, goodwill, use, data, or other intangible losses."
        ]
      }
    ]
  },
  
  privacy: {
    sections: [
      {
        title: "Information We Collect",
        content: [
          "We collect information you provide directly to us, such as when you create an account, participate in events, or contact us for support.",
          "We also collect information automatically when you use our platform, including usage data and device information."
        ]
      },
      {
        title: "How We Use Your Information",
        items: [
          "Provide and maintain our services",
          "Process transactions and send related information",
          "Send you technical notices and support messages",
          "Communicate with you about events and updates",
          "Monitor and analyze usage patterns to improve our services"
        ]
      },
      {
        title: "Information Sharing",
        content: [
          "We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent.",
          "We may share information in certain limited circumstances, such as to comply with legal requirements or protect our rights."
        ]
      },
      {
        title: "Data Security",
        content: [
          "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
          "However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security."
        ]
      },
      {
        title: "Your Rights",
        items: [
          "Access and update your personal information",
          "Request deletion of your account and data",
          "Opt-out of marketing communications",
          "Export your data in a portable format"
        ]
      },
      {
        title: "Contact Us",
        content: [
          "If you have any questions about this Privacy Policy, please contact us at privacy@fansday.com"
        ]
      }
    ]
  },
  
  cookies: {
    sections: [
      {
        title: "What Are Cookies",
        content: [
          "Cookies are small text files that are stored on your device when you visit our website.",
          "They help us provide you with a better experience by remembering your preferences and improving our services."
        ]
      },
      {
        title: "Types of Cookies We Use",
        items: [
          "Essential Cookies: Required for the website to function properly",
          "Analytics Cookies: Help us understand how visitors interact with our website",
          "Functional Cookies: Remember your preferences and settings",
          "Marketing Cookies: Used to deliver relevant advertisements"
        ]
      },
      {
        title: "Managing Cookies",
        content: [
          "You can control and manage cookies in various ways. Please note that removing or blocking cookies can impact your user experience.",
          "Most browsers allow you to refuse cookies or alert you when cookies are being sent."
        ]
      },
      {
        title: "Third-Party Cookies",
        content: [
          "We may use third-party services that set cookies on your device, such as analytics providers.",
          "These third parties have their own cookie policies, and we have no control over their cookies."
        ]
      },
      {
        title: "Updates to This Policy",
        content: [
          "We may update this Cookies Policy from time to time. Any changes will be posted on this page with an updated revision date."
        ]
      }
    ]
  }
};

// Function to insert sample data into the database
export const insertSampleStaticPages = async () => {
  try {
    console.log('Inserting sample static pages data...');
    
    const insertPromises = Object.entries(sampleData).map(async ([pageType, content]) => {
      const { data, error } = await supabase
        .from('static_pages')
        .upsert(
          {
            page_type: pageType,
            content: content,
          },
          {
            onConflict: 'page_type'
          }
        );
      
      if (error) {
        console.error(`Error inserting ${pageType}:`, error);
        return { pageType, success: false, error };
      }
      
      console.log(`✅ Successfully inserted/updated ${pageType} page`);
      return { pageType, success: true, data };
    });
    
    const results = await Promise.all(insertPromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`\n📊 Results: ${successful} successful, ${failed} failed`);
    
    if (failed > 0) {
      console.log('❌ Failed pages:', results.filter(r => !r.success));
    }
    
    return results;
  } catch (error) {
    console.error('Error in insertSampleStaticPages:', error);
    return null;
  }
};

// Usage: Run this function from your browser console or in a React component
// insertSampleStaticPages();
