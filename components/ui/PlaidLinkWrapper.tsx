"use client"; // Ensure this is a client component

import PlaidLink from "./PlaidLink"; // Import your existing PlaidLink component

interface PlaidLinkWrapperProps {
    user: User,
    initialAccessToken: string
    action: 'reauthenticate' | 'addConsent'
}

const PlaidLinkWrapper = ({ user, initialAccessToken, action }: PlaidLinkWrapperProps)  => {
    return (
        <div>
            <PlaidLink user={user} variant={action} accesstoken={initialAccessToken} />
        </div>
      );
};

export default PlaidLinkWrapper;
