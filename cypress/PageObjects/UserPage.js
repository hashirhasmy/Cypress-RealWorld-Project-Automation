class UserPage {

    userPage_WebLocators = {
        userNavbar_button: "a[href='/users']",
        ADD_USER_BUTTON: "[data-testid='AddIcon']",
        FIRST_NAME_FIELD: '#first_name',
        LAST_NAME_FIELD: '#last_name',
        EMAIL_ID_FIELD: '#email',
        LEVEL_DROPDOWN: "#level",
        ASSIGN_BRANDS: "#brandId",
        SAVE_USER_BUTTON: "button[type='submit']:nth-of-type(2)",
        NOTIFICATION_SUCCESS_MESSAGE: "notification_text",
        EDIT_USER_BUTTON: "tbody>tr:nth-child(1)  [data-testid='EditIcon']",
        SEARCH_USER: "#outlined-basic",
        DEACTIVATE_USER_BUTTON: "input[type='checkbox']",
        DELETEUSRER_BUTTON: "[data-testid='DeleteIcon']",
        CONFIRM_DEACTIVE_USER: "button[type='button']:nth-child(2):last-child",
        CONFIRM_DELETE_USER: "button[type='button']:nth-child(2):last-child",
        VERIFY_USER_DELETD: "img[alt='card image']"
    }

    click_userNavbar() {
        cy.get(this.userPage_WebLocators.userNavbar_button).click()
    }

    verify_userNavbar_for_normal_User() {
        return cy.get(this.userPage_WebLocators.userNavbar_button)
    }

    user_created_successNotification() {
        return cy.getBySel(this.userPage_WebLocators.NOTIFICATION_SUCCESS_MESSAGE)
    }
    user_deleted_successNotification() {
        return cy.getBySel(this.userPage_WebLocators.NOTIFICATION_SUCCESS_MESSAGE)
    }

    createUser(firstName, lastName, email, userRole) {
        cy.get(this.userPage_WebLocators.ADD_USER_BUTTON).click()
        cy.get(this.userPage_WebLocators.FIRST_NAME_FIELD).type(firstName)
        cy.get(this.userPage_WebLocators.LAST_NAME_FIELD).type(lastName)
        cy.get(this.userPage_WebLocators.EMAIL_ID_FIELD).type(email)
        cy.get(this.userPage_WebLocators.LEVEL_DROPDOWN).click()
        cy.get(`li[data-value=${userRole}]`).click({ multiple: true })
        cy.get(this.userPage_WebLocators.SAVE_USER_BUTTON).click({ force: true })
    }

    updateUser(firstName, lastName) {
        cy.get(this.userPage_WebLocators.EDIT_USER_BUTTON).click()
        cy.get(this.userPage_WebLocators.FIRST_NAME_FIELD).clear().type(firstName)
        cy.get(this.userPage_WebLocators.LAST_NAME_FIELD).clear().type(lastName)
        cy.get(this.userPage_WebLocators.EMAIL_ID_FIELD).should('have.attr', 'disabled')
        cy.get(this.userPage_WebLocators.ASSIGN_BRANDS).should('be.visible')
        cy.get(this.userPage_WebLocators.SAVE_USER_BUTTON).click({ force: true })
    }

    search_User(userName) {
        cy.get(this.userPage_WebLocators.SEARCH_USER).type(userName)
    }
    verify_normal_user_assignrd_Brands() {
        cy.get(this.userPage_WebLocators.EDIT_USER_BUTTON).click()
        cy.get(this.userPage_WebLocators.ASSIGN_BRANDS).should('be.visible').click()
        cy.get("[aria-selected='true']").should('have.length', 2)
    }

    return_Assigned_Brand_Count() {
        return cy.get("[aria-selected='true']").its('length')
    }

    deactivate_User_buttonOption() {
        cy.get(this.userPage_WebLocators.DEACTIVATE_USER_BUTTON).eq(0).click();
        cy.get(this.userPage_WebLocators.CONFIRM_DEACTIVE_USER).click()
    }

    verify_user_deactivated_successfully() {
        return cy.get("[data-test=notification_text]")
    }

    delete_Middleware_activeUser() {
        cy.get(this.userPage_WebLocators.DELETEUSRER_BUTTON).eq(0).click()
        cy.get(this.userPage_WebLocators.CONFIRM_DELETE_USER).click()
    }

    verify_USer_deleted_successfully() {
        return cy.get(this.userPage_WebLocators.VERIFY_USER_DELETD)
    }


}

export default UserPage;