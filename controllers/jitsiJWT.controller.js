const { default: axios } = require('axios');
const jsonwebtoken = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Importing UUID v4 for generating IDs
const crypto = require('crypto');

// Store your private key as a multi-line string in PEM format
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDWIDhS1f53IFRd
zLdjemXgTM+uXVW3cRvhRxgJSZaPZn3Zn1A1Cqt/Dq7rc64vtoHk7tPKBVakCMyb
8bhGWAk4rWcPdGQBEO3vhVW1rA7sdjmclMHsEBv3unX9XUz1QOeVQkbR/i1ZJfSh
Bh3FQ1IPQpEq+5Vpw3rDramw7AHbOt2sZ+dXTc/z5N6uTZe7vXj5QeYQuhZkt2K8
XKBV505xpilBjPfNuN2hoZ9Xv52dkUR2T5K54KsbtiKCNTlmF+gLe66mpxtKY7OL
LAB4AIWxnt5L+NpiHNs7rIRAg7fzI2H2nDlYT6RsYFWqvvLm7sp0V/VgL8AWyK+S
P1kUpMdLAgMBAAECggEBALuJdqseX4OIXjvVC51l2wpLW+3UMzm6J/fzo1qnB+XK
l1jdzorWMIPUoWD4bUu+ph+TCQ08BbkfN80xNPrvKgxo2wXPI7NHV41bk0jNTDjQ
Bv9bzkhph4U92w8wAzIeSXYRmSNcYe1db9cEG1jk8F8LJ0elFySNn9z4IdIhsjKF
zlwAmTWNBZCYjiJeqPVbSShhf9uumWOId8+owzaXeRWls2hfhoY4vG5wUysLkvvT
X2Ei6QV7TVHm/Fajc18m0e165ORq1ivz4wMPoGhmgCninpAQmGvCRuntsHx2tH4D
YuIl6zxbdfowaZGcj6o65CRrgL2d/8qcSKkN1olpR7ECgYEA90NqeIuNk9HFLs5A
UWQiq0cBerQft3Pn+v7cnZeS/YibRG9hNFgkvWjz5sVDLqzAaUMV9tnDMzybdLlu
nUwaxBx4u0mGer2DeFqRCNKMRLdw2qdk8JwmMteqFjxp/mXonze0psKibOIjpRVc
7wc5Vs/5Nkk2pGgD4mahO6eENtMCgYEA3bEQWwz/8zbAMw7I5HjCYj9NCSI6d4zm
9P4Zx2tZDLCDTgzSAsHBH9rawEAtgklSt6bM5mMWFVcQTcVZ+jEOHWO0N2nG+VGb
Sd9Yebjp3b2IlOSz/MV3IBQZ7qDrAICzsJmbPgfWGtUdSbadIsGB8iYYcU+lxoix
fixXpzHfUqkCgYEAnVJVkfEo2V5kmU09ewu9S0DYXhvw+iZS+U3jTJm+OnYKZFaB
gG58oc7/MFteTXo4ykCW3wLaweTT/EZnbMmZViHPZ0p2t+2Qkqj9EqH0AVy9/0D2
ZmjTnRG+9Hrn7aclhPhKhrfb5G9Vwpl/Ec6E2wlkRPf8Pkq3/frSp0QESWUCgYBT
1+2JogcDIwfZx5Ou5QUPR0WJWMqoAEAxFBEH3M+W/wMJ98tNg53YwFrPLvaHOdfw
4ULJN1xYwc7Guwbmmrrt3pGAC59XF8gVTkUV9Btu44nOVhjEVqJRHYkZOP7n98T9
23pdIXWWPFeRU2FmjazpugKwiCD4TyZhw7962l/N0QKBgQDtZxNu4EqexGPUU93I
RcKnoPQUsnbMkw4KCLVKRPVNPfXw7pzQZxXONMRQepjoU5pZ6ua4hDnLSEEfk3rf
qhUJvZeUcycfXHFTpUsnFQHGR2FKnl7Y7sXgPnF6ra53kPIfL0isMUgq7qistzfM
gJGMxqsQQ4h5wVbmokiqIireqQ==
-----END PRIVATE KEY-----
`;

const generateJaaSToken = (privateKey, { id, name, email, avatar, appId, kid }) => {
    const now = new Date();
    const jwt = jsonwebtoken.sign({
        aud: 'jitsi',
        context: {
            user: {
                id,
                name,
                avatar,
                email,
                // moderator: 'true'
            },
            features: {
                "livestreaming": "false",
                "outbound-call": "false",
                "transcription": "false",
                "recording": "false"
            },
            "room": {
                "regex": false
            }
        },
        iss: 'chat',
        room: '*',
        sub: appId,
        exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
        // nbf: Math.round(now.getTime() / 1000) - 300 // Adjusted to prevent future time issues
    }, privateKey, { algorithm: 'RS256', header: { kid } });

    return jwt;
};

// Endpoint for generating JWT
const getJITSIJWT = async (req, res) => {
    try {
        const { userName, userEmail, avatar } = req.query;

        const token = generateJaaSToken(privateKey, {
            id: uuidv4(),
            name: userName,
            email: userEmail,
            avatar,
            appId: "vpaas-magic-cookie-58f484fa173f4cda981a9ed1d8fc7a8f",
            kid: "vpaas-magic-cookie-58f484fa173f4cda981a9ed1d8fc7a8f/f9e04b"
        });

        res.json({ token });
    } catch (error) {
        console.error("Error generating JWT:", error);
        res.status(500).json({ error: "Failed to generate JWT" });
    }
};


const verifySignature = (req, secret) => {
    console.log('Incoming request headers:', req.headers);
    console.log('Request body:', req.body);

    const signatureHeader = req.headers['x-jaas-signature']; 
    if (!signatureHeader) {
        console.log('Signature header not found');
        return false;
    }

    const signatureParts = signatureHeader.split(',');
    const timestampPart = signatureParts.find(part => part.startsWith('t='));
    const signaturePart = signatureParts.find(part => part.startsWith('v1='));

    if (!timestampPart || !signaturePart) {
        console.log('Invalid signature format: Missing timestamp or signature');
        return false;
    }

    const eventTimestamp = timestampPart.split('=')[1]; 
    let signature = signaturePart.split('=')[1].trim(); 

    console.log('Extracted timestamp:', eventTimestamp);
    console.log('Extracted signature (before cleaning):', signature);

    signature = signature.replace(/"/g, '');
    console.log('Extracted signature (after cleaning):', signature);

    const signedPayload = `${eventTimestamp}.${JSON.stringify(req.body)}`;
    console.log('Signed payload:', signedPayload);

    const expectedSignature = crypto.createHmac('sha256', secret)
                                      .update(signedPayload)
                                      .digest('base64')
                                      .trim();

    // Log the expected signature
    console.log('Expected signature:', expectedSignature);

    if (signature.length !== expectedSignature.length) {
        console.log('Signature length mismatch:', signature.length, expectedSignature.length);
        console.log('Signature  mismatch:', signature, expectedSignature);

        return false;
    }

    const comparisonResult = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    console.log('Signature comparison result:', comparisonResult);

    return comparisonResult;
};








module.exports = { getJITSIJWT };
