describe("Banka", ()=>{

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('_AUTH_', '_UI_')
    })
    
    it("user can register", ()=>{
        Cypress.Keyboard.defaults({
            keystrokeDelay: 50,
        })

        cy.intercept({
            method: "post",
            url:"http://localhost:5000/auth/cookie"
        }).as("cookie");

        cy.intercept({
            method: "post",
            url:"http://localhost:5000/auth/register"
        }).as("register");

        cy.visit("http://localhost:1500/registration")
        
        // register
            cy.wait('@cookie');
            cy.findByTitle(/register_lay_btn/i).click()
            cy.findByTitle(/register_email_input/i).type("Banka@sqr.com")
            cy.findByTitle(/register_password_input/i).type("L.e123456")
            cy.findByTitle(/register_cpassword_input/i).type("L.e123456")
            cy.findByTitle(/register_btn/i).click()
            cy.wait('@register');

            cy.findByTitle("success_btn").click()
            cy.wait(1500);
    })

    it("user can login", ()=>{
        Cypress.Keyboard.defaults({
            keystrokeDelay: 50,
        })

        cy.intercept({
            method: "post",
            url:"http://localhost:5000/auth/login"
        }).as("login");
        
        // login
            cy.findByTitle(/login_email_input/i).type("Banka@ng.com")
            cy.findByTitle(/login_password_input/i).type("L.e123456")
            cy.findByTitle(/login_btn/i).click()
            cy.wait('@login')
            cy.wait(1500);
    })

    it("user can update profile", ()=>{
        Cypress.Keyboard.defaults({
            keystrokeDelay: 50,
        })

        cy.intercept({
            method: "post",
            url:"http://localhost:5000/user/updateprofile"
        }).as("save_setting");
        
        // complete profile
            cy.findByTitle(/show_menu/i).click();
            cy.wait(1500);
            cy.findByTitle(/setting_btn/i).click();
            cy.wait(1500);
            cy.findByTitle(/first_name/i).type("Banka")
            cy.findByTitle(/last_name/i).type("open source")
            cy.findByTitle(/save_setting/i).click()
            cy.wait('@save_setting');
            cy.findByTitle("success_btn").click()
            cy.wait(1500);
    })

    it("user can deposite", ()=>{
        Cypress.Keyboard.defaults({
            keystrokeDelay: 50,
        })

        cy.intercept({
            method: "post",
            url:"http://localhost:5000/user/deposite"
        }).as("deposite");
        
        //  deposite
            cy.findByTitle(/show_menu/i).click();
            cy.wait(2000);
            cy.findByTitle(/profile_btn/i).click();
            cy.wait(2000);
            cy.findByTitle(/new_transaction/i).click();
            cy.wait(2000);
            cy.findByTitle(/open_deposite/i).click();
            cy.wait(2000);
            cy.findByTitle(/deposite_amount/i).type(2000)
            cy.findByTitle("deposite_btn").click()
            cy.wait('@deposite');
            cy.findByTitle("success_btn").click()

            cy.wait(1500);
    })


    it("user can withdraw", ()=>{
        Cypress.Keyboard.defaults({
            keystrokeDelay: 50,
        })

        cy.intercept({
            method: "post",
            url:"http://localhost:5000/user/withdraw"
        }).as("withdraw");
        
        // withdraw
            cy.findByTitle(/new_transaction/i).click();
            cy.wait(2000);
            cy.findByTitle(/open_withdraw/i).click();
            cy.wait(2000);
            cy.findByTitle(/withdraw_amount/i).type(1000)
            cy.findByTitle("withdraw_btn").click()
            cy.wait('@withdraw');
            cy.findByTitle("success_btn").click()
            cy.wait(2000);
            
            cy.findByTitle(/refresh/i).click();
            cy.wait(1500);
    })

    it("user can transfer", ()=>{
        Cypress.Keyboard.defaults({
            keystrokeDelay: 50,
        })
        
        // transfer
            cy.findByTitle(/new_transaction/i).click();
            cy.findByTitle(/open_transfer/i).click();
        // transfer can not be made here because you need to know
        // account number of the other user

        cy.clearCookie('_AUTH_') //clear the cookie
        cy.clearCookie('_UI_') //clear the cookie
    })
})


