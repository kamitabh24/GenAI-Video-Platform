describe('GenAI Video Creation Studio Workflows', () => {
  beforeEach(() => {
    // Navigate to the video creation studio canvas before each test
    cy.visit('/studio');
  });

  it('Should mock video generation API and validate multi-modal canvas interactions', () => {
    // 1. NETWORK MOCKING: Intercept the heavy generation API to bypass GPU rendering
    cy.intercept('POST', '/api/v1/generate-video', {
      statusCode: 200,
      delay: 800, // Simulate brief network latency
      body: {
        status: 'success',
        job_id: 'genvid_98765',
        video_url: 'https://mock-cdn.genai-video.com/render/test-video.mp4'
      }
    }).as('generateVideoRequest');

    // 2. AVATAR SELECTION: Automate UI drawer and selection
    cy.get('[data-testid="avatar-drawer-btn"]').click();
    cy.get('[data-testid="avatar-card-tchouameni"]').click();
    cy.get('[data-testid="selected-avatar-label"]').should('contain.text', 'Tchouaméni');

    // 3. VOICE CONFIGURATION: Interact with settings dropdowns
    cy.get('[data-testid="voice-settings-tab"]').click();
    cy.get('[data-testid="voice-select-dropdown"]').select('English - Professional (Male)');
    
    // 4. SCRIPT INJECTION: Multi-modal text integration
    const promoScript = "Welcome to hit.com. Predict the match outcome now and win big!";
    cy.get('[data-testid="script-editor-textarea"]').type(promoScript);
    cy.get('[data-testid="char-count"]').should('contain.text', promoScript.length.toString());

    // 5. TRIGGER GENERATION & VALIDATE PAYLOAD
    cy.get('[data-testid="generate-video-btn"]').click();
    cy.get('[data-testid="loading-spinner"]').should('be.visible');

    // Assert the frontend sent the correct parameters to the backend before the mock responds
    cy.wait('@generateVideoRequest').then((interception) => {
      expect(interception.request.body.prompt).to.equal(promoScript);
      expect(interception.request.body.avatar_id).to.equal('tchouameni');
    });

    // 6. MEDIA VERIFICATION: Validate native HTML5 video player and CORS bypass
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
    cy.get('video[data-testid="result-video-player"]')
      .should('be.visible')
      .and('have.attr', 'src', 'https://mock-cdn.genai-video.com/render/test-video.mp4');

    // Programmatically trigger playback to ensure DOM integrity
    cy.get('video[data-testid="result-video-player"]').then(($video) => {
      $video[0].play();
      expect($video[0].paused).to.be.false;
    });
  });
});
