# Pennie AI Chat Widget - Embed Documentation

## Quick Start

Add this code to your website before the closing `</body>` tag:

```html
<script>
  window.PennieChatConfig = {
    sfdcLeadId: 'YOUR_SALESFORCE_LEAD_ID'
  };
</script>
<script src="https://ai-chatbot-sandbox.vercel.app/embed.js"></script>
```

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `sfdcLeadId` | string | Yes | - | Salesforce Lead ID for tracking |
| `position` | string | No | 'bottom-right' | Widget position on screen |
| `theme` | string | No | 'light' | Color theme |
| `baseUrl` | string | No | auto-detected | Your deployed domain |

### Position Options
- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

## Advanced Usage

### Programmatic Control

```javascript
// Open widget programmatically
window.PennieChat.open();

// Close widget programmatically
window.PennieChat.close();

// Toggle widget
window.PennieChat.toggle();

// Destroy widget
window.PennieChat.destroy();
```

### Dynamic Initialization

```javascript
// Load script dynamically
const script = document.createElement('script');
script.src = 'https://ai-chatbot-sandbox.vercel.app/embed.js';
script.onload = function() {
  window.PennieChat.init({
    sfdcLeadId: 'dynamic-lead-id-123',
    position: 'bottom-left'
  });
};
document.body.appendChild(script);
```

### Custom Configuration Example

```html
<script>
  window.PennieChatConfig = {
    sfdcLeadId: 'LEAD_12345',
    position: 'bottom-left',
    theme: 'light',
    fabSize: 60,           // Custom FAB button size
    widgetWidth: 450,      // Custom widget width
    widgetHeight: 650      // Custom widget height
  };
</script>
<script src="https://ai-chatbot-sandbox.vercel.app/embed.js"></script>
```

## Integration Examples

### WordPress

Add to your theme's `footer.php` before `</body>`:

```php
<script>
  window.PennieChatConfig = {
    sfdcLeadId: '<?php echo get_user_meta(get_current_user_id(), 'sfdc_lead_id', true); ?>'
  };
</script>
<script src="https://ai-chatbot-sandbox.vercel.app/embed.js"></script>
```

### React/Next.js

```jsx
import { useEffect } from 'react';

export default function Layout({ children }) {
  useEffect(() => {
    // Load embed script
    const script = document.createElement('script');
    script.src = 'https://ai-chatbot-sandbox.vercel.app/embed.js';

    // Configure widget
    window.PennieChatConfig = {
      sfdcLeadId: 'YOUR_LEAD_ID',
      position: 'bottom-right'
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (window.PennieChat) {
        window.PennieChat.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
```

### Shopify

Add to your theme's `theme.liquid` before `</body>`:

```liquid
<script>
  window.PennieChatConfig = {
    sfdcLeadId: '{{ customer.tags | first }}'
  };
</script>
<script src="https://ai-chatbot-sandbox.vercel.app/embed.js"></script>
```

## Troubleshooting

### Widget not appearing?

1. **Check browser console for errors**
   - Open DevTools (F12) and look for error messages
   - Verify the script is loading successfully

2. **Verify sfdcLeadId is provided**
   ```javascript
   console.log(window.PennieChatConfig);
   ```

3. **Ensure script URL is correct**
   - Test the URL directly in browser
   - Check for typos in the domain

4. **Check for Content Security Policy restrictions**
   - Your website might block external scripts
   - Add your domain to CSP allow list

### Iframe not loading?

1. **Verify your domain allows iframe embedding**
   - Check X-Frame-Options headers
   - Ensure CSP allows frame-ancestors

2. **Check CORS settings**
   - Verify CORS headers are configured correctly
   - Test from different domains

3. **Ensure /chat route is accessible**
   - Visit https://ai-chatbot-sandbox.vercel.app/chat directly
   - Check for 404 or 500 errors

### Widget positioned incorrectly?

```javascript
// Try different position
window.PennieChatConfig = {
  sfdcLeadId: 'YOUR_LEAD_ID',
  position: 'bottom-left' // or 'top-right', 'top-left'
};
```

### Widget overlapping content?

```javascript
// Adjust z-index if needed
const container = document.getElementById('pennie-chat-container');
if (container) {
  container.style.zIndex = '999999'; // Adjust as needed
}
```

## Mobile Responsive

The widget is fully responsive and adapts to mobile screens:

- **Desktop**: 400px × 600px widget
- **Mobile**: Uses `max-w-[90vw]` and `max-h-[80vh]`
- **Touch support**: All interactions work on touch devices

## Security Notes

### Data Privacy
- Widget communicates via postMessage API
- Iframe is sandboxed for security
- No sensitive data stored in localStorage
- All communication encrypted via HTTPS

### Cross-Origin Communication
- Widget uses secure postMessage protocol
- Origin validation can be enabled
- HTTPS required in production

### Content Security Policy

If your site uses CSP, add these directives:

```
Content-Security-Policy:
  frame-src https://ai-chatbot-sandbox.vercel.app;
  script-src https://ai-chatbot-sandbox.vercel.app;
  img-src https://ai-chatbot-sandbox.vercel.app;
```

## Performance

### Load Time
- Script size: ~8KB (minified)
- Async loading: Won't block page render
- Lazy iframe: Only loads when opened

### Caching
- Embed script cached for 1 hour
- Logo and assets cached by browser
- Conversations persisted in sessionStorage

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## API Reference

### Methods

#### `PennieChat.init(config)`
Initialize the widget with custom configuration.

**Parameters:**
- `config` (object): Configuration options

**Example:**
```javascript
window.PennieChat.init({
  sfdcLeadId: 'LEAD_123',
  position: 'bottom-right'
});
```

#### `PennieChat.open()`
Open the chat widget.

**Example:**
```javascript
window.PennieChat.open();
```

#### `PennieChat.close()`
Close the chat widget.

**Example:**
```javascript
window.PennieChat.close();
```

#### `PennieChat.toggle()`
Toggle the widget open/closed state.

**Example:**
```javascript
window.PennieChat.toggle();
```

#### `PennieChat.destroy()`
Remove the widget from the page.

**Example:**
```javascript
window.PennieChat.destroy();
```

### Events

The widget emits the following events via postMessage:

- `close-chat-widget`: User clicked close button in chat

**Listen for events:**
```javascript
window.addEventListener('message', (event) => {
  if (event.data === 'close-chat-widget') {
    console.log('User closed the chat widget');
  }
});
```

## Support

For integration support:
- Check the [example page](https://ai-chatbot-sandbox.vercel.app/embed-example.html)
- Review troubleshooting section above
- Contact: support@pennie.ai

## License

© 2024 Pennie Financial. All rights reserved.
