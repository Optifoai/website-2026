import axios from 'axios';

const OLLAMA_CHAT_URL = import.meta.env.DEV
    ? '/ollama/v1/chat'
    : 'https://fastapi.optifo.in/ollama/v1/chat';
const OLLAMA_API_KEY = 'c57c6f64f6069d60cd06be2f87594ca12174771073757078f319715f2323cf19';
const OLLAMA_MODEL = 'qwen2.5:7b-instruct';
const OLLAMA_TEMPERATURE = 0.2;

const OPTIONAL_FIELD_LABELS = {
    color: 'Color',
    fuelType: 'Fuel Type',
    transmission: 'Transmission',
    engine: 'Engine',
    mileage: 'Mileage',
    seatingCapacity: 'Seating Capacity',
    bodyType: 'Body Type',
    variant: 'Variant',
    numberOfDoors: 'Number of Doors',
};

function pickNonEmpty(value) {
    if (value === undefined || value === null) {
        return '';
    }
    return String(value).trim();
}

function buildPrompt(payload = {}) {
    const details = [
        `Brand: ${pickNonEmpty(payload.brand)}`,
        `Model: ${pickNonEmpty(payload.model)}`,
        `Year: ${pickNonEmpty(payload.year)}`,
        `Type: ${pickNonEmpty(payload.type)}`,
    ];

    Object.entries(OPTIONAL_FIELD_LABELS).forEach(([key, label]) => {
        const value = pickNonEmpty(payload[key]);
        if (value) {
            details.push(`${label}: ${value}`);
        }
    });

    const features = (payload.features || []).map(pickNonEmpty).filter(Boolean);
    const featureBlock = features.length
        ? features.map((name) => `- ${name}`).join('\n')
        : 'None specified';

    return [
        'You are an expert automotive content writer.',
        '',
        'Write a professional, engaging, SEO-friendly car description.',
        '',
        'Car Details:',
        details.join('\n'),
        '',
        'Features:',
        featureBlock,
        '',
        'Requirements:',
        '- 120–200 words',
        '- Professional tone',
        '- Highlight the vehicle\'s strengths',
        '- Mention the provided features naturally',
        '- Do not invent specifications that were not provided',
        '- Do not use markdown',
        '- Return plain text only.',
    ].join('\n');
}

/**
 * Generate a car description with the Ollama chat API.
 * Returns the shape the car feature form already expects.
 */
export async function generateCarDescription(payload, config = {}) {
    const response = await axios.post(
        OLLAMA_CHAT_URL,
        {
            model: OLLAMA_MODEL,
            messages: [
                {
                    role: 'user',
                    content: buildPrompt(payload),
                },
            ],
            temperature: OLLAMA_TEMPERATURE,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': OLLAMA_API_KEY,
            },
            signal: config.signal,
            timeout: config.timeout || 120000,
        }
    );

    const description = String(response?.data?.content || '').trim();

    if (!description) {
        return {
            statusCode: 0,
            error: { responseMessage: '' },
        };
    }

    return {
        statusCode: 1,
        responseData: { description },
    };
}
