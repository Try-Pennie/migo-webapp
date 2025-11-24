(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.PennieChat) return;

  const PennieChat = {
    config: {},
    isOpen: false,
    elements: {},

    init: function(userConfig) {
      // Merge user config with defaults
      this.config = {
        sfdcLeadId: userConfig.sfdcLeadId || '',
        position: userConfig.position || 'bottom-right',
        theme: userConfig.theme || 'light',
        baseUrl: userConfig.baseUrl || window.location.origin,
        fabSize: 56,
        widgetWidth: 400,
        widgetHeight: 600,
        ...userConfig
      };

      // Validate required config
      if (!this.config.sfdcLeadId) {
        console.warn('[PennieChat] Warning: sfdcLeadId not provided');
      }

      // Create widget elements
      this.createWidget();
      this.attachEventListeners();
    },

    createWidget: function() {
      // Create container
      const container = document.createElement('div');
      container.id = 'pennie-chat-container';
      container.style.cssText = 'position: fixed; z-index: 999999; font-family: system-ui, -apple-system, sans-serif;';
      this.setPosition(container);

      // Create FAB button
      const fab = document.createElement('button');
      fab.id = 'pennie-chat-fab';
      fab.style.cssText = `
        width: ${this.config.fabSize}px;
        height: ${this.config.fabSize}px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 300ms ease-in-out;
        background: white;
        border: 1px solid #e5e7eb;
        overflow: hidden;
      `;
      fab.setAttribute('aria-label', 'Open Pennie AI Chat');

      // Add Migo logo
      const logo = document.createElement('img');
      logo.src = `${this.config.baseUrl}/migo-logo-removebg-preview.png`;
      logo.alt = 'Migo';
      logo.style.cssText = 'width: 32px; height: 32px; object-fit: contain;';
      fab.appendChild(logo);

      // Create widget wrapper
      const widgetWrapper = document.createElement('div');
      widgetWrapper.id = 'pennie-chat-widget';
      widgetWrapper.style.cssText = `
        position: absolute;
        bottom: ${this.config.fabSize + 18}px;
        right: 0;
        width: ${this.config.widgetWidth}px;
        max-width: 90vw;
        height: ${this.config.widgetHeight}px;
        max-height: 80vh;
        opacity: 0;
        transform: scale(0.95) translateY(10px);
        transform-origin: bottom right;
        transition: all 300ms ease-in-out;
        pointer-events: none;
      `;

      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.id = 'pennie-chat-iframe';
      const iframeUrl = new URL(`${this.config.baseUrl}/chat`);
      if (this.config.sfdcLeadId) {
        iframeUrl.searchParams.set('sfdc_lead_id', this.config.sfdcLeadId);
      }
      iframe.src = iframeUrl.toString();
      iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        border: 1px solid #e5e7eb;
        background: white;
      `;
      iframe.title = 'Pennie AI Chat';
      iframe.allow = 'microphone; camera';

      widgetWrapper.appendChild(iframe);
      container.appendChild(fab);
      container.appendChild(widgetWrapper);
      document.body.appendChild(container);

      // Store references
      this.elements = { container, fab, widgetWrapper, iframe, logo };
    },

    setPosition: function(container) {
      const positions = {
        'bottom-right': 'bottom: 24px; right: 24px;',
        'bottom-left': 'bottom: 24px; left: 24px;',
        'top-right': 'top: 24px; right: 24px;',
        'top-left': 'top: 24px; left: 24px;'
      };
      container.style.cssText += positions[this.config.position] || positions['bottom-right'];
    },

    attachEventListeners: function() {
      // FAB click handler
      this.elements.fab.addEventListener('click', () => this.toggle());

      // Listen for close message from iframe
      window.addEventListener('message', (event) => {
        // Security: verify origin if needed
        // if (event.origin !== this.config.baseUrl) return;

        if (event.data === 'close-chat-widget') {
          this.close();
        }
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    },

    toggle: function() {
      this.isOpen ? this.close() : this.open();
    },

    open: function() {
      this.isOpen = true;
      const { widgetWrapper, fab, logo } = this.elements;

      // Show widget
      widgetWrapper.style.opacity = '1';
      widgetWrapper.style.transform = 'scale(1) translateY(0)';
      widgetWrapper.style.pointerEvents = 'auto';

      // Update FAB to close button
      fab.style.background = '#101828';
      fab.style.border = 'none';
      logo.style.display = 'none';

      // Add close icon
      const closeIcon = document.createElement('div');
      closeIcon.id = 'pennie-close-icon';
      closeIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style="width: 32px; height: 32px;">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      `;
      fab.appendChild(closeIcon);

      fab.setAttribute('aria-label', 'Close Pennie AI Chat');
    },

    close: function() {
      this.isOpen = false;
      const { widgetWrapper, fab, logo } = this.elements;

      // Hide widget
      widgetWrapper.style.opacity = '0';
      widgetWrapper.style.transform = 'scale(0.95) translateY(10px)';
      widgetWrapper.style.pointerEvents = 'none';

      // Restore FAB
      fab.style.background = 'white';
      fab.style.border = '1px solid #e5e7eb';
      logo.style.display = 'block';

      // Remove close icon
      const closeIcon = document.getElementById('pennie-close-icon');
      if (closeIcon) closeIcon.remove();

      fab.setAttribute('aria-label', 'Open Pennie AI Chat');
    },

    // Public API
    destroy: function() {
      if (this.elements.container) {
        this.elements.container.remove();
      }
      delete window.PennieChat;
    }
  };

  // Auto-initialize if config exists
  if (window.PennieChatConfig) {
    PennieChat.init(window.PennieChatConfig);
  }

  // Expose to window
  window.PennieChat = PennieChat;
})();
