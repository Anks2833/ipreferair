import React from 'react'
import { Link } from 'react-router-dom' // Importing Link for navigation between pages
import { ArrowUpRightFromSquare } from 'lucide-react' // Importing icon for the "User Data Deletion" link
import { motion } from 'framer-motion' // Importing motion for animation effects on the component

// Policy component to display Privacy Policy page
const Policy = () => {
  return (
    // Using motion.div to apply a fade-in effect when the component mounts
    <motion.div 
        initial={{ opacity: 0 }} // Initial state: invisible
        animate={{ opacity: 1 }} // Final state: fully visible
        exit={{ opacity: 0 }} // When leaving, fade out
        transition={{
            duration: .5, // Transition duration for fade effect
            ease: "easeInOut" // Easing function for smooth animation
        }}
        className='flex flex-col gap-5 px-4 sm:px-6 lg:px-20 pt-24 pb-10 bg-white' // Flexbox layout for the component with padding and background
    >
        {/* Privacy Policy Title */}
        <div className='font-semibold text-3xl'>Privacy Policy</div>

        {/* Effective Date of the Privacy Policy */}
        <div className='font-medium text-xl'>Effective Date: 11th of October 2024</div>

        {/* Introduction section */}
        <div>
            <div className='font-medium'>Introduction</div>
            <div className='font-serif'>
                {/* Text explaining the website's commitment to privacy and the link to the website */}
                At Velora, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website {" "}
                <Link 
                    to='/' 
                    className='text-[#48aadf]' // Custom styling for the link
                >
                    Velora.com
                </Link>
                , use our services, and make purchases from our ecommerce store. We comply with the General Data Protection Regulation (GDPR), California Online Privacy Protection Act (CalOPPA), and other applicable laws.
            </div>
        </div>

        {/* Information collection section */}
        <div>
            <div className='font-medium'>Information We Collect</div>
            <div className='font-serif flex flex-col gap-2'>
                {/* List of types of information the website collects */}
                We may collect the following types of information when you visit our site, register an account, or place an order:
                <ul className='list-disc px-8'>
                    <li>Personal Information: Name, email address, billing/shipping addresses, phone number, and payment details.</li>
                    <li>Non-Personal Information: Browser type, IP address, browsing behavior, and device information.</li>
                    <li>Cookies and Tracking Data: We use cookies and similar tracking technologies to enhance your experience on our website. This data helps us understand your preferences and improve our services.</li>
                </ul>
            </div>
        </div>

        {/* How the collected information is used */}
        <div>
            <div className='font-medium'>How We Use Your Information</div>
            <div className='font-serif flex flex-col gap-2'>
                {/* List of purposes for using personal data */}
                We use your personal data for the following purposes:
                <ul className='list-disc px-8'>
                    <li>Order Fulfillment: To process your orders, manage payments, and deliver products.</li>
                    <li>Customer Support: To respond to your inquiries, resolve issues, and provide technical assistance.</li>
                    <li>Marketing Communications: With your consent, we may send promotional emails about our products, services, or offers.</li>
                    <li>Website Improvement: To analyze how users interact with our website, so we can improve its performance and user experience.</li>
                </ul>
            </div>
        </div>

        {/* Legal basis for processing information (GDPR compliance) */}
        <div>
            <div className='font-medium'>Legal Basis for Processing (GDPR Compliance)</div>
            <div className='font-serif flex flex-col gap-2'>
                {/* Legal grounds for processing personal data under GDPR */}
                Under the GDPR, we process your personal data based on the following legal grounds:
                <ul className='list-disc px-8'>
                    <li>Consent: When you sign up for newsletters or agree to our cookies.</li>
                    <li>Contractual Obligation: To process your orders and deliver services.</li>
                    <li>Legitimate Interest: For fraud prevention, improving website functionality, and personalized marketing (with your consent).</li>
                    <li>Legal Compliance: When necessary to comply with legal obligations.</li>
                </ul>
            </div>
        </div>

        {/* User rights under GDPR */}
        <div>
            <div className='font-medium'>User Rights Under GDPR</div>
            <div className='font-serif flex flex-col gap-2'>
                {/* List of rights for users located in the European Economic Area */}
                If you are located in the European Economic Area (EEA), you have the following rights regarding your personal data:
                <ul className='list-disc px-8'>
                    <li>Right of Access: You can request a copy of the personal data we hold about you.</li>
                    <li>Right to Rectification: You can ask us to correct inaccurate or incomplete data.</li>
                    <li>Right to Erasure: You can request that we delete your personal data under certain conditions.</li>
                    <li>Right to Restrict Processing: You have the right to request limited use of your personal data.</li>
                    <li>Right to Data Portability: You can request that we transfer your data to another organization.</li>
                    <li>Right to Object: You can object to the processing of your data for direct marketing purposes.</li>
                    <li>Right to Withdraw Consent: You can withdraw your consent for data processing at any time.</li> 
                </ul>
                {/* Contact information for exercising these rights */}
                To exercise any of these rights, please contact us at <span className='text-[#48aadf]'>velora@info.com</span>.
            </div>
        </div>

        {/* Do Not Track compliance for CalOPPA */}
        <div>
            <div className='font-medium'>Do Not Track (CalOPPA Compliance)</div>
            <div className='font-serif'>
                {/* Information about not responding to Do Not Track signals */}
                California law requires us to disclose how we respond to "Do Not Track" (DNT) browser signals. Our website does not currently respond to DNT signals. However, we use cookies and other tracking technologies to enhance your experience. You can adjust your browser settings to control cookie preferences.
            </div>
        </div>

        {/* Data Security section */}
        <div>
            <div className='font-medium'>Data Security</div>
            <div className='font-serif flex flex-col gap-2'>
                {/* List of security measures implemented to protect personal information */}
                We implement a variety of security measures to maintain the safety of your personal information:
                <ul className='list-disc px-8'>
                    <li>Encryption: We use SSL encryption to protect sensitive data during transmission.</li>
                    <li>Access Control: Access to your personal information is limited to authorized personnel who need it to perform their job functions.</li>
                    <li>Secure Payments: We use third-party payment processors that are PCI-DSS compliant.</li>
                </ul>
            </div>
        </div>
        
        {/* Cookies and Tracking Technologies section */}
        <div>
            <div className='font-medium'>Cookies and Tracking Technologies</div>
            <div className='font-serif flex flex-col gap-2'>
                {/* Explanation of how cookies and tracking are used */}
                Cookies are small text files stored on your device to help us recognize you on future visits and provide a personalized experience. We use both first-party and third-party cookies for purposes such as:
                <ul className='list-disc px-8'>
                    <li>Functionality: Remembering your preferences and improving your user experience.</li>
                    <li>Analytics: Understanding how users interact with our site to make improvements.</li>
                    <li>Marketing: Showing you relevant ads based on your browsing behavior.</li> 
                </ul>
            </div>
        </div>

        {/* Links to manage cookie settings */}
        <div className='font-serif'>
            You can manage cookie settings in your browser or opt out of targeted ads by visiting sites such as {" "}
            <Link 
                to='/https://adssettings.google.com' 
                target='_blank'
                className='text-[#48aadf]'>
                Google Ads Preferences Manager {" "}
            </Link> or  {" "}
            <Link 
                to='/https://www.youronlinechoices.com' 
                target='_blank'
                className='text-[#48aadf]'>
                Your Online Choices
            </Link>.
        </div>
        
        {/* Third-Party Services and Links disclaimer */}
        <div>
            <div className='font-medium'>Third-Party Services and Links</div>
            <div className='font-serif'>
                {/* Disclaimer about third-party links on the website */}
                Our website may include links to third-party websites or services. Please note that we are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </div>
        </div>
        
        {/* Children's Privacy section for CalOPPA compliance */}
        <div>
            <div className='font-medium'>Children's Privacy (CalOPPA Compliance)</div>
            <div className='font-serif'>
                {/* Information on children's data collection */}
                We do not knowingly collect personal data from children under 13. If we become aware that we have inadvertently collected such information, we will take steps to delete it as soon as possible. If you are a parent or guardian and believe we have collected data from a child, please contact us at <Link className='text-[#48aadf]'>velora@info.com</Link>.
            </div>
        </div>
        
        {/* Data Retention policy */}
        <div>
            <div className='font-medium'>Data Retention</div>
            <div className='font-serif'>
                {/* Data retention policy explanation */}
                We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected or to comply with legal obligations. Once data is no longer required, it will be securely deleted or anonymized.
            </div>
        </div>
        
        {/* International Data Transfers section */}
        <div>
            <div className='font-medium'>International Data Transfers</div>
            <div className='font-serif'>
                {/* Information on international data transfers */}
                If you are accessing our website from outside the United States, please be aware that your personal data may be transferred to, and processed in, the US or other jurisdictions. We take necessary steps to ensure that international data transfers comply with applicable privacy laws.
            </div>
        </div>
        
        {/* Changes to Privacy Policy section */}
        <div>
            <div className='font-medium'>Changes to This Privacy Policy</div>
            <div className='font-serif'>
                {/* Information about updates to the privacy policy */}
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When changes are made, we will post the updated policy on this page and update the "Effective Date" above. Please review this page regularly to stay informed about our data practices.
            </div>
        </div>
        
        {/* Contact Information */}
        <div>
            <div className='font-medium'>Contact Us</div>
            <div className='font-serif flex flex-col gap-2'>
                If you have any questions or concerns about this Privacy Policy or your personal data, please contact us at:
                <ul className='list-disc px-8'>
                    <li>Email: <Link className='text-[#48aadf]'>velora@info.com</Link></li>
                    <li>Phone: <Link className='text-[#48aadf]'>+90 783 678 08</Link></li>
                    <li>Address: 1A Abraham Street, Mary Land Road, Mary Land, Nigeria</li>
                </ul>
                
            </div>
        </div>
        
        <Link to='/user-data-deletion-policy' className='text-[#48aadf] flex items-center gap-1'>
            User Data Deletion
            <ArrowUpRightFromSquare className='cursor-pointer text-[#48aadf] p-1'/>
        </Link>
    </motion.div>
  )
}

export default Policy