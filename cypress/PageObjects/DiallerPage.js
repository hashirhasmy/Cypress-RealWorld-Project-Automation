class DiallerPage {

    DIALER_SELECTORS = {
        BRAND: "dialer_brand_selector",
        BRAND_OPTION_360: "brand_option_46",
        BRAND_OPTION_KW: "brand_option_57",
        ZIP: "dialer_zip_code",
        CALLER_ID: "dialer_caller_id",
        PROCEED: "split_button",
        APPLICATION_PANEL: "dialer_application_pannel"
    }

    click_Applicationpanal_Button(){
        cy.getBySel(this.DIALER_SELECTORS.APPLICATION_PANEL).click()
    }

    verify_normaluser_assigned_brands_Count(){
        cy.getBySel(this.DIALER_SELECTORS.BRAND_OPTION_360).should('be.visible')
        cy.getBySel(this.DIALER_SELECTORS.BRAND_OPTION_KW).should('be.visible')
    }



}
export default DiallerPage;