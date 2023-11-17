/// <reference types="cypress" />

import HomePage from "../../PageObjects/homePage"
import UserPage from "../../PageObjects/UserPage"
import properties from "../../fixtures/properties.json"
import DiallerPage from "../../PageObjects/DiallerPage"

const DIALER_SELECTORS = {
    BRAND: "dialer_brand_selector"
}

describe("userCreation/update/Delete Flow suit tests", () => {
    beforeEach(function () {
        const rt = Cypress.env('RT')
        const domain = Cypress.env('BACKEND_URL')
        cy.setCookie("rt", rt, { domain: domain, httpOnly: false, secure: true, sameSite: "no_restriction" })
    })

    function genarateRandomEmail() {
        let randomString = Math.random().toString(36).substring(2, 10)
        return randomString + "@gmail.com"
    }

    it("TC_001_Verify admin user can create a normal agent user in middleware", () => {
        const homePage = new HomePage();
        const userPage = new UserPage();
        cy.loginApp(properties.zipCode, properties.callerId)
        homePage.click_Application_panal()
        cy.reload()
        userPage.click_userNavbar()
        userPage.createUser("Hashir", "testing", genarateRandomEmail(), "40")
        cy.getBySel("notification_text").then(x => {
            let successNotification = x.text()
            assert.equal(successNotification, "User has been added successfully")
        })
    })

    for (let i = 0; i <= 1; i++) {
        it(`TC_002_${i} Verify duplicate emails are not allowing while creating a agent in middleware`, () => {
            const homePage = new HomePage();
            const userPage = new UserPage();
            cy.loginApp(properties.zipCode, properties.callerId)
            homePage.click_Application_panal()
            cy.reload()
            userPage.click_userNavbar()
            userPage.createUser("Hashir1", "testing", "achirahashir@gmail.com", "40")
            cy.get("div[class='dialog user-dialog'] form small").should('be.visible')
        })
    }

    it("TC_003_Verify without required fields unable to create a user working correctly", () => {
        const homePage = new HomePage();
        const userPage = new UserPage();
        cy.loginApp(properties.zipCode, properties.callerId)
        homePage.click_Application_panal()
        cy.reload()
        userPage.click_userNavbar()
        cy.get("[data-testid='AddIcon']").click()
        cy.get("button[type='submit']:nth-of-type(2)").click({ force: true })
        cy.focused().then(($input) => {
            expect($input[0].validationMessage).to.contain('Please fill')
        })
    })

    context("Special test case 1", () => {
        it("TC_004_Verify normal user level agents don't have the access to user tab", () => {
            const rt = Cypress.env('NORMAL_AGENT_RT')
            const domain = Cypress.env('BACKEND_URL')
            cy.setCookie("rt", rt, { domain: domain, httpOnly: false, secure: true, sameSite: "no_restriction" })
            const homePage = new HomePage();
            const userPage = new UserPage();
            cy.loginApp(properties.zipCode, properties.callerId)
            homePage.click_Application_panal()
            cy.reload()
            userPage.verify_userNavbar_for_normal_User().should('not.exist')
        })
    })

    it("TC_005_Verify admin can update a middleware agent details properly working", () => {
        const homePage = new HomePage()
        const userPage = new UserPage()
        cy.loginApp(properties.zipCode, properties.callerId)
        homePage.click_Application_panal()
        cy.reload()
        userPage.click_userNavbar()
        userPage.updateUser("Mohamed Hashir", "test updating")
        cy.wait(3000)
        userPage.user_created_successNotification().should('have.text', "User has been updated successfully")
    })

    it("TC_006_Verify normal user assigned brands correctly stored in DB", () => {
        const homePage = new HomePage();
        const userPage = new UserPage();
        cy.loginApp(properties.zipCode, properties.callerId)
        homePage.click_Application_panal()
        cy.reload()
        userPage.click_userNavbar()
        userPage.search_User("Sakuni Nimasha")
        cy.wait(5000)
        userPage.verify_normal_user_assignrd_Brands()
        userPage.return_Assigned_Brand_Count().should('eq', 2)
    })

    //This test case depends on "Verify normal user assigned brands correctly stored in DB"
    context("Special test case 2", () => {
        it("TC_007_Verify normal user's already assigned brands only he can pick from dialler page having brand field", () => {
            const rt = Cypress.env('NORMAL_AGENT_RT')
            const domain = Cypress.env('BACKEND_URL')
            cy.setCookie("rt", rt, { domain: domain, httpOnly: false, secure: true, sameSite: "no_restriction" })
            const diallerPage = new DiallerPage()
            const userPage = new UserPage();
            cy.visit(`/dialer?media=MANUAL&zip_code=&caller_id=&channel_id=&channel_name=&interaction_guid=`).then(() => {
                cy.getBySel(DIALER_SELECTORS.BRAND).click()
                diallerPage.verify_normaluser_assigned_brands_Count()
            })
        })
    })

    it("TC_008_Verify deactivating user feature working correctly", () => {
        const homePage = new HomePage();
        const userPage = new UserPage();
        cy.loginApp(properties.zipCode, properties.callerId)
        homePage.click_Application_panal()
        cy.reload()
        userPage.click_userNavbar()
        userPage.createUser("Deactivation", "testing", genarateRandomEmail(), "40")
        cy.wait(1000)
        userPage.user_created_successNotification().should('have.text', "User has been added successfully")
        userPage.search_User("Deactivation testing")
        cy.wait(3000)
        userPage.deactivate_User_buttonOption()
        cy.wait(1000)
        userPage.verify_user_deactivated_successfully().should('have.text', "User has been deactivated successfully")
    })

    it("TC_009_Verifying after deleting a user not showing in middleware permanatly", () => {
        const homePage = new HomePage();
        const userPage = new UserPage();
        cy.loginApp(properties.zipCode, properties.callerId)
        homePage.click_Application_panal()
        cy.reload()
        userPage.click_userNavbar()
        userPage.createUser("DeleteUser", "testing", genarateRandomEmail(), "40")
        userPage.user_created_successNotification().should('have.text', "User has been added successfully")
        userPage.search_User("DeleteUser testing")
        cy.wait(5000)
        userPage.delete_Middleware_activeUser()
        userPage.user_deleted_successNotification().should('have.text', "User has been permanently deleted successfully")
        userPage.verify_USer_deleted_successfully().should('be.visible')
    })

    function createUser() {
        const homePage = new HomePage();
        const userPage = new UserPage();
        cy.loginApp(properties.zipCode, properties.callerId)
        homePage.click_Application_panal()
        cy.reload()
        userPage.click_userNavbar()
        userPage.createUser("Mohamed", "Hashir111", genarateRandomEmail(), "40")
    }

    it("TC_010_Verify user count diplaying correctly in user page", () => {

        for (let i = 0; i < 1; i++) {
            createUser();
        }

        const homePage = new HomePage();
        const userPage = new UserPage();
        cy.loginApp(properties.zipCode, properties.callerId)
        homePage.click_Application_panal()
        cy.reload()
        userPage.click_userNavbar()
        cy.wait(3000)
        userPage.search_User("Mohamed Hashir111")
        cy.wait(3000)
        cy.get('table tbody')
            .find('tr')
            .should('have.length.gt', 0)
            .then((tableRows) => {
                const rowCountInTable = tableRows.length;
                cy.get('strong')
                    .then((pageCountText) => {
                        const pageCount = parseInt(pageCountText.text());
                        expect(rowCountInTable).to.equal(pageCount);
                    });
            });
    })

    it('TC_011_Verify Pagination works correctly in user page relevent to total user count', () => {
        const homePage = new HomePage();
        const userPage = new UserPage();
        cy.loginApp(properties.zipCode, properties.callerId)
        homePage.click_Application_panal()
        cy.reload()
        userPage.click_userNavbar()
        cy.wait(3000)
        // Get the total user count from your page once before the loop
        cy.get('strong').then(($element) => {
            let totalUserCount = parseInt($element.text());
            let currentPage = 1;
            const usersPerPage = 10;
            // Define a function to verify the "Next Page" button state
            const verifyNextPageButtonState = (expectedPageCount) => {
                cy.get("[data-testid='NavigateNextIcon']").should((button) => {
                    if (currentPage === expectedPageCount) {
                        console.log("inside if condition = " + currentPage)
                        console.log("inside if condition = " + expectedPageCount)
                        //expect(button).to.have.attr('disabled');
                    } else {
                        expect(button).not.to.have.attr('disabled');
                    }
                });
            };
            while (currentPage * usersPerPage < totalUserCount) {
                cy.log("in side loop currentPage * usersPerPage = " + currentPage * usersPerPage)
                cy.get("[data-testid='NavigateNextIcon']").click();
                currentPage++;
                cy.log("in side loop page count : " + currentPage)
                verifyNextPageButtonState(Math.ceil(totalUserCount / usersPerPage));
            }
        });
    });

})