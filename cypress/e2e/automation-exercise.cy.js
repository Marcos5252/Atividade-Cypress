import { faker } from "@faker-js/faker";

describe('Automation Exercise', () => {

    // Variáveis globais para compartilhar entre os testes
    let email;
    let password;

    // ============================
    // TC01 – Cadastro de Usuário
    // ============================

    it('TC01: Cadastro de Usuario', () => {

        // Gerando email e senha que serão usados no TC02
        email = faker.internet.email();
        password = faker.internet.password();

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const phoneNumber = faker.phone.number();
        const company = faker.company.name();
        const adress = faker.location.streetAddress();
        const zipCode = faker.location.zipCode();

        cy.visit('https://automationexercise.com/');
        cy.get('a[href="/login"]').click();

        cy.get('input[data-qa="signup-name"]').type(firstName);
        cy.get('input[data-qa="signup-email"]').type(email);
        cy.get('button[data-qa="signup-button"]').click();

        cy.get('#id_gender1').check();
        cy.get('[data-qa=password]').type(password);

        cy.get('[data-qa=days]').select('10');
        cy.get('[data-qa=months]').select('May');
        cy.get('[data-qa=years]').select('2000');

        cy.get('#newsletter').check();

        cy.get('[data-qa=first_name]').type(firstName);
        cy.get('[data-qa=last_name]').type(lastName);
        cy.get('[data-qa=company]').type(company);
        cy.get('[data-qa=address]').type(adress);
        cy.get('[data-qa=country]').select('Canada');
        cy.get('[data-qa=state]').type('Alberta');
        cy.get('[data-qa=city]').type('Calgary');
        cy.get('[data-qa=zipcode]').type(zipCode);
        cy.get('[data-qa=mobile_number]').type(phoneNumber);

        cy.get('[data-qa=create-account]').click();

    });


    // ========================================
    // TC02 – Login com o usuário criado no TC01
    // ========================================

    it('TC02: Login de Usuario', () => {

        cy.visit('https://automationexercise.com/');
        cy.get('a[href="/login"]').click();

        // Aqui entramos com o mesmo email/senha criados no TC01
        cy.get('[data-qa=login-email]').type(email);
        cy.get('[data-qa=login-password]').type(password);
        cy.get('[data-qa=login-button]').click();

        cy.contains('Logged in as').should('be.visible');
    });


    // ===============================
    // TC03 – Login com conta inválida
    // ===============================

    it('TC03: Testar com conta inexistente', () => {

        cy.visit('https://automationexercise.com/');
        cy.get('a[href="/login"]').click();

        cy.contains('Login to your account').should('be.visible');

        cy.get('input[data-qa="login-email"]').type('inexistente'+ faker.number.int() +'@gmail.com');
        cy.get('input[data-qa="login-password"]').type('senhaerrada');

        cy.get('button[data-qa="login-button"]').click();

        cy.contains('Your email or password is incorrect!').should('be.visible');
    });


    // ===================
    // TC04 – Logout
    // ===================

    it('TC04 : Logout de Usuario', () => {

        cy.visit('https://automationexercise.com/');
        cy.get('a[href="/login"]').click();

        cy.get('[data-qa=login-email]').type(email);
        cy.get('[data-qa=login-password]').type(password);
        cy.get('[data-qa=login-button]').click();

        cy.contains('Logged in as').should('be.visible');

        cy.get('a[href="/logout"]').click();

        cy.url().should('include', '/login');
        cy.contains('Login to your account').should('be.visible');
    });

    
    // ========================================
    // TC05 – Testar registro com e-mail existente
    // ========================================

    it('TC05 : Registrar com e-mail já existente', () => {

        cy.visit('https://automationexercise.com/');
        cy.get('a[href="/login"]').click();

        cy.contains('New User Signup!').should('be.visible');

        cy.get('input[data-qa="signup-name"]').type('Teste');
        cy.get('input[data-qa="signup-email"]').type(email);

        cy.get('button[data-qa="signup-button"]').click();

        cy.contains('Email Address already exist!').should('be.visible');
    });

    it('TC06 : Contato com o formulário de suporte', () => {
        const firstName = faker.person.firstName();
        email = faker.internet.email();

        cy.visit('https://automationexercise.com/');
        cy.get('a[href="/contact_us"]').click();


        cy.get('input[data-qa="name"]').type(firstName);

        cy.get('input[data-qa="email"]').type(email);

        cy.get('input[data-qa="subject"]').type('Teste de Suporte');
        cy.get('textarea[data-qa="message"]').type('Esta é uma mensagem de teste para o formulário de suporte.');

        //Seleconar arquivo random
        cy.get('input[name="upload_file"]').selectFile('cypress/fixtures/example.json');
        cy.get('input[data-qa="submit-button"]').click();

        cy.contains('Success! Your details have been submitted successfully.').should('be.visible');

        cy.get('a.btn.btn-success').click();
        cy.url().should('eq', 'https://automationexercise.com/');
    });

});
