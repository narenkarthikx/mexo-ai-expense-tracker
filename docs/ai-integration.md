# AI Integration Guide

This guide covers the Google Gemini AI integration for receipt processing in the Expense Tracker PWA.

## 🤖 Overview

The application uses Google Gemini AI (gemini-2.5-flash model) to:
- Extract text from receipt images
- Parse expense details automatically
- Classify expenses into categories
- Extract merchant and payment information

## 🔧 Setup

### 1. Google AI API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to your `.env.local`:
   ```env
   GOOGLE_GEMINI_API_KEY=your_api_key_here
   ```

### 2. Model Configuration
The app uses the `gemini-2.5-flash` model for optimal balance of speed and accuracy:
- Fast processing (< 2 seconds typical)
- High accuracy for receipt text
- Cost-effective for high-volume usage

## 📡 API Integration

### Receipt Processing Endpoint
**Endpoint**: `POST /api/process-receipt`

**Request Format**:
```typescript
{
  image: string,      // Base64 encoded image
  userId: string,     // User UUID
  description?: string // Optional manual description
}
```

**Response Format**:
```typescript
{
  success: boolean,
  data?: {
    expenseId: string,
    amount: number,
    description: string,
    category: string,
    merchant?: string,
    date?: string,
    confidence: number,
    extractedData: object
  },
  error?: string
}
```

### Implementation Details

The AI processing happens in `/app/api/process-receipt/route.ts`:

```typescript
// AI prompt for receipt processing
const prompt = `
Analyze this receipt image and extract the expense information.
Return ONLY a JSON object with these fields:
{
  "amount": number (total amount),
  "description": "brief description",
  "merchant": "store/merchant name",
  "category": "appropriate category",
  "date": "YYYY-MM-DD format",
  "confidence": number (0-1 confidence score)
}
`;

// Generate content with image
const result = await model.generateContent([
  prompt,
  {
    inlineData: {
      data: base64Image,
      mimeType: "image/jpeg"
    }
  }
]);
```

## 🔍 Data Extraction

### Supported Information
- **Amount**: Total expense amount
- **Merchant**: Store or vendor name
- **Date**: Transaction date
- **Items**: Individual line items (stored in `extracted_data`)
- **Payment Method**: Cash, card, etc.
- **Category**: Auto-classified expense category

### Category Classification
The AI automatically classifies expenses into these categories:
- Groceries
- Dining
- Transportation
- Shopping
- Healthcare
- Entertainment
- Utilities
- Travel
- Gas
- Other (fallback)

### Example Extraction Result
```json
{
  "amount": 45.67,
  "description": "Grocery shopping at Supermarket",
  "merchant": "Fresh Foods Market",
  "category": "Groceries",
  "date": "2024-01-15",
  "confidence": 0.95,
  "extracted_data": {
    "items": [
      {"name": "Apples", "price": 5.99},
      {"name": "Bread", "price": 3.49},
      {"name": "Milk", "price": 4.29}
    ],
    "tax": 2.45,
    "payment_method": "Credit Card"
  }
}
```

## 🛡️ Error Handling

### Common Scenarios

1. **Invalid Image Format**
   ```json
   {
     "success": false,
     "error": "Unsupported image format. Please use JPEG or PNG."
   }
   ```

2. **AI Processing Failed**
   ```json
   {
     "success": false,
     "error": "Failed to extract expense data from receipt"
   }
   ```

3. **API Rate Limit**
   ```json
   {
     "success": false,
     "error": "AI service temporarily unavailable. Please try again."
   }
   ```

### Fallback Handling
```typescript
// If AI fails, create manual entry
if (!aiSuccess) {
  const manualExpense = await createManualExpense({
    userId,
    description: description || "Receipt upload",
    amount: 0, // User must edit
    processing_status: 'failed'
  });
}
```

## 🔧 Configuration

### Model Parameters
```typescript
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.1,        // Low randomness for accuracy
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1024,   // Sufficient for receipt data
  }
});
```

### Safety Settings
```typescript
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  // Additional safety configurations
];
```

## 📊 Performance Optimization

### Image Processing
1. **Resize large images** before sending to API
2. **Compress images** to reduce upload time
3. **Support multiple formats**: JPEG, PNG, WebP

### Caching Strategy
```typescript
// Cache successful extractions
const cacheKey = `receipt_${imageHash}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// Store result for future
await redis.setex(cacheKey, 3600, JSON.stringify(result));
```

### Batch Processing
For multiple receipts:
```typescript
const promises = images.map(image => 
  processReceipt(image, userId)
);
const results = await Promise.allSettled(promises);
```

## 🧪 Testing AI Integration

### Manual Testing
1. Upload test receipt images
2. Verify extracted data accuracy
3. Check confidence scores
4. Test error scenarios

### Test Images
Use these types for comprehensive testing:
- Clear grocery receipts
- Restaurant bills
- Gas station receipts
- Blurry/poor quality images
- Non-receipt images (should fail gracefully)

### Validation Script
```javascript
// Test receipt processing
async function testReceiptProcessing() {
  const testImage = await loadTestImage();
  const response = await fetch('/api/process-receipt', {
    method: 'POST',
    body: JSON.stringify({
      image: testImage,
      userId: 'test-user-id'
    })
  });
  
  const result = await response.json();
  console.log('AI Result:', result);
}
```

## 📈 Monitoring and Analytics

### Track Success Rates
```sql
-- AI processing success rate
SELECT 
  processing_status,
  COUNT(*) as count,
  AVG(ai_confidence) as avg_confidence
FROM expenses 
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY processing_status;
```

### Performance Metrics
- Average processing time
- Success/failure rates
- Confidence score distribution
- Category classification accuracy

## 🔐 Security Considerations

### Data Privacy
1. **No permanent image storage** - Images processed in memory
2. **Encrypted API keys** - Store securely in environment
3. **User data isolation** - Each user's data separate

### API Security
```typescript
// Validate user authentication
const { data: { user }, error } = await supabase.auth.getUser();
if (!user) {
  return NextResponse.json(
    { error: 'Unauthorized' }, 
    { status: 401 }
  );
}
```

## 🆘 Troubleshooting

### Common Issues

1. **"Invalid API key"**
   - Verify `GOOGLE_GEMINI_API_KEY` in `.env.local`
   - Check API key permissions in Google Cloud

2. **"Model not found"**
   - Ensure using `gemini-2.5-flash` (correct model name)
   - Check if model is available in your region

3. **Low accuracy results**
   - Try different image quality
   - Adjust prompt engineering
   - Consider image preprocessing

### Debug Mode
Enable detailed logging:
```typescript
const DEBUG_AI = process.env.NODE_ENV === 'development';

if (DEBUG_AI) {
  console.log('AI Prompt:', prompt);
  console.log('AI Response:', response);
  console.log('Extracted Data:', extractedData);
}
```

## 🚀 Future Enhancements

### Planned Features
- **Multi-language support** for international receipts
- **Batch processing** for multiple receipts
- **Smart suggestions** based on user patterns
- **OCR fallback** for AI processing failures
- **Custom category training** for business users

### Performance Improvements
- **Edge function deployment** for faster processing
- **Image optimization** pipeline
- **Real-time confidence scoring**
- **Progressive enhancement** for offline scenarios

## 📚 Additional Resources

- [Google Gemini AI Documentation](https://ai.google.dev/)
- [Vision API Best Practices](https://cloud.google.com/vision/docs/best-practices)
- [Image Processing Guidelines](https://developers.google.com/machine-learning/vision/image-classification/classification-guide)
- [Receipt Processing Patterns](https://cloud.google.com/document-ai/docs/processors-list#processor_doc-type_receipt)