// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("getBySel", (selector, ...args) => {
    return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
    return cy.get(`[data-test*=${selector}]`, ...args);
});

const DIALER_SELECTORS = {
    BRAND: "dialer_brand_selector",
    BRAND_OPTION: "brand_option_46",
    ZIP: "dialer_zip_code",
    CALLER_ID: "dialer_caller_id",
    PROCEED: "split_button"
}

//custom command for login
Cypress.Commands.add('loginApp', (zipCode, callerId) => {
    cy.visit(`/dialer?media=MANUAL&zip_code=&caller_id=&channel_id=&channel_name=&interaction_guid=`)
    cy.getBySel(DIALER_SELECTORS.BRAND).click()
    cy.getBySel(DIALER_SELECTORS.BRAND_OPTION).click()
    cy.getBySel(DIALER_SELECTORS.ZIP).type(zipCode)
    cy.getBySel(DIALER_SELECTORS.CALLER_ID).type(callerId)
    cy.getBySel(DIALER_SELECTORS.PROCEED).click()
    cy.location("pathname").should("eq", "/home");
})
