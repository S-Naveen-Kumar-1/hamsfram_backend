const { default: axios } = require('axios');
const jsonwebtoken = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Importing UUID v4 for generating IDs
const crypto = require('crypto');

// Store your private key as a multi-line string in PEM format
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCi9tJlg0HjcKcB
AfwkGrswM6RWQfN8a/tCy7zcPxHrxdWtpSobYvLxw0f7HqtQsCyG6jc51ygOuchw
+49L/VvLPCorjJSJs9cQnjOWInE3eALKdhJalA+qHgqT1oGl1BYBQvrBy0lv3pVL
AVOdL7fOj/Y7ocZNflHY+pH+fjywPaxNT8teKHNvR/7FRjxF5WgRNmIRuIxhdFoS
p//n+3mCI+qYIlSsS8yJoC1blVgsFt2nDx4sk4DNsQ1Xni5qLJcaLZjHC6gWHizJ
rc8NCLDDkhxps2phPCavEx8DWUkZphSP5daL/fX0/kEh6seadYpDHZ0g7bEFr2Yc
intERh/ZAgMBAAECggEBAJC+rk3f8cv0KUGp46yl2ZGMrPC4j2358yh3Ef6GPoKu
K4aaZvYAQ00daHfR29RFRqdmrTrAsiGyPiisJ7EVDk1L2SDpMp3EkMd/3M4DNZBR
FhmCGfc9/1PYbwi0xF7oK8tfFJ7A0y98AhqmyP+afKYKFGkO3bXC9yvEE5x5v6nB
C8+ScMBYU9gpyFpJAYBxbD6Bg5ozA+18zGN7c6RH9NtJ4F1bmJ21eYePjhgmtj3h
hkrP7VYyFw01k3pRIWfVfC5QPZ0xCTNwprATdejw4MfccDkjCaJnMrfJu+x5Imuk
KUKHLyAXiFooJYoR4FZB2tPklOjq2W1wcr9p/pgpTaECgYEA+HfZi9u0PbAwUAfu
l5V2bRfhp2UxHaJrAdyS6bp40Wwrie9hZSkn3Czpuw0GAESP3YRwLd9JjmQRjmc/
0zLlOUapTluraEYSZmuT0reL2J+AGMhostNShhDHjRl1QnQfSenZgYj9dzviPMmc
LA8sHGHYniu7ARz/8Ut4+joHrX0CgYEAp+dytfVW0pKEcItt6kHSsdQySNu7qUDX
QN262KBZbQsYcIezDlgp/CTWXiX5DIE1IQeicpD3Pm/vhDeDv4tw+GUIGF2JlCcm
nnDGMpETSbDOPh1iqhcs3ayNFPggWh1f7ZUPyBJtQJvjRuj/4kmidHXVCAvHGJy1
VL99wNE2eo0CgYEAorPAhf/ZeCe+izmWeDaMNQXVYws1bWVk0vRAU8MiyGgf3pQd
X+PiUSAr8aumiVhcKL9HwhIcFZzbjjd4KPGD/syRo1kN1htEg0LgqrQ8ZB6WACSD
ws30lQu50GCiU2C8+GakYll1OLXDAPE4TfWlefRsp66VJzZ5NuWoE5saWfUCgYEA
i7EPCf31XzoRQAVwzC45WkQeFenipr1QmSIguuwlmohZq/3qZevJ+oK3axsSqmmx
Ryqv57teSK8eShVZ4nnj4nVEF+lydjVgdv+Clj2HG48i+CDAnpyrcj6GHkUVvYOk
9OhIef+Cr/dCTxO5GI6Ev3ntZEVQPtTaNIkg2dP2DF0CgYAhsnM6/aicQfwfHUz7
HYCO266nW0ocIe68jLdkJpmavPQS6eUuaLRWhbMB17X1CtVvkrYaj6na+vSVmNzS
bk8lR8EkyHV2fIXS/gzGDpP4Wzz9a0GBKPzlYCOUbKagLNjMY7xIX8wXqOL7QPTO
ASPI1prZgFhV+q8HyxlCKPLhQw==
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
            appId: "vpaas-magic-cookie-98baf07e5c814fcf916303445347ef17",
            kid: "vpaas-magic-cookie-98baf07e5c814fcf916303445347ef17/5b6b0c"
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
