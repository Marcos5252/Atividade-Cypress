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


    it('TC02: Login de Usuario', () => {

        cy.visit('https://automationexercise.com/');
        cy.get('a[href="/login"]').click();

        // Aqui entramos com o mesmo email/senha criados no TC01
        cy.get('[data-qa=login-email]').type(email);
        cy.get('[data-qa=login-password]').type(password);
        cy.get('[data-qa=login-button]').click();

        cy.contains('Logged in as').should('be.visible');
    });



    it('TC03: Testar com conta inexistente', () => {

        cy.visit('https://automationexercise.com/');
        cy.get('a[href="/login"]').click();

        cy.contains('Login to your account').should('be.visible');

        cy.get('input[data-qa="login-email"]').type('inexistente' + faker.number.int() + '@gmail.com');
        cy.get('input[data-qa="login-password"]').type('senhaerrada');

        cy.get('button[data-qa="login-button"]').click();

        cy.contains('Your email or password is incorrect!').should('be.visible');
    });


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

    it('TC08 : verificar produtos na página de produtos', () => {

        cy.visit('https://automationexercise.com/');


        cy.get('body').should('be.visible');


        cy.get('a[href="/products"]').click();

        cy.contains('All Products', { timeout: 10000 }).should('be.visible');
        cy.url().should('include', '/products');


        cy.get('.features_items .product-image-wrapper')
            .should('be.visible')
            .and('have.length.greaterThan', 0);


        cy.get('.features_items .product-image-wrapper')
            .first()
            .find('a[href^="/product_details/"]')
            .click();


        cy.url().should('include', '/product_details/');



        // Nome do produto
        cy.get('.product-information h2')
            .should('be.visible')
            .and('not.be.empty');

        // Categoria
        cy.get('.product-information p')
            .contains('Category')
            .should('be.visible');

        // Preço
        cy.get('.product-information span span')
            .first()
            .should('be.visible')
            .and('contain', 'Rs.');

        // Availability
        cy.get('.product-information p')
            .contains('Availability')
            .should('be.visible');

        // Condition
        cy.get('.product-information p')
            .contains('Condition')
            .should('be.visible');

        // Brand
        cy.get('.product-information p')
            .contains('Brand')
            .should('be.visible');


    });

    it('TC9: Buscar produtos e validar resultados', () => {

        cy.visit('https://automationexercise.com/');

        cy.get('body').should('be.visible');


        cy.get('a[href="/products"]').click();


        cy.contains('All Products', { timeout: 10000 }).should('be.visible');
        cy.url().should('include', '/products');


        const searchTerm = "dress";
        cy.get('#search_product').type(searchTerm);
        cy.get('#submit_search').click();


        cy.contains('Searched Products', { timeout: 10000 }).should('be.visible');

        cy.get('.features_items .product-image-wrapper')
            .should('be.visible')
            .and('have.length.greaterThan', 0);
    });

    it('TC10: Verificar inscrição no footer (Subscription)', () => {

        cy.visit('https://automationexercise.com/');


        cy.get('body').should('be.visible');


        cy.scrollTo('bottom');


        cy.contains('Subscription', { timeout: 10000 }).should('be.visible');

        //Inserir email e clicar na seta
        const email = `teste${Date.now()}@gmail.com`;   // evita conflito de e-mails
        cy.get('#susbscribe_email').type(email);
        cy.get('#subscribe').click();

        //Verificar mensagem de sucesso
        cy.contains('You have been successfully subscribed!')
            .should('be.visible');
    });
    it('TC15: Fazer Pedido: Cadastre-se antes de finalizar a compra', () => {

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const company = faker.company.name();
        const address = faker.location.streetAddress();
        const zipCode = faker.location.zipCode();
        const phone = faker.phone.number();

        cy.visit('https://automationexercise.com/');
        cy.get('body').should('be.visible');

        // Clicando em Signup/Login
        cy.get('a[href="/login"]').click();

        // Criando conta
        cy.get('[data-qa="signup-name"]').type(firstName + ' ' + lastName);
        cy.get('[data-qa="signup-email"]').type(email);
        cy.get('[data-qa="signup-button"]').click();

        cy.get('#id_gender1').check();
        cy.get('[data-qa=password]').type(password);
        cy.get('[data-qa=days]').select('10');
        cy.get('[data-qa=months]').select('May');
        cy.get('[data-qa=years]').select('2000');
        cy.get('#newsletter').check();

        cy.get('[data-qa=first_name]').type(firstName);
        cy.get('[data-qa=last_name]').type(lastName);
        cy.get('[data-qa=company]').type(company);
        cy.get('[data-qa=address]').type(address);
        cy.get('[data-qa=country]').select('Canada');
        cy.get('[data-qa=state]').type('Alberta');
        cy.get('[data-qa=city]').type('Calgary');
        cy.get('[data-qa=zipcode]').type(zipCode);
        cy.get('[data-qa=mobile_number]').type(phone);

        cy.get('[data-qa=create-account]').click();

        // Verificação de criação de conta
        cy.contains('Account Created!').should('be.visible');
        cy.get('[data-qa="continue-button"]').click();

        // Verificar login
        cy.contains('Logged in as').should('be.visible');

        // Adicionar produto ao carrinho
        cy.get('a[href="/products"]').click();

        // Aguardar carregamento da página de produtos
        cy.contains('All Products').should('be.visible');

        // Clicar no primeiro produto para abrir a página de detalhes
        cy.get('.product-image-wrapper')
            .first()
            .find('a[href^="/product_details/"]')
            .click();

        // Aguardar carregamento da página de detalhes do produto
        cy.url().should('include', '/product_details/');

        // Adicionar ao carrinho da página de detalhes (mais confiável)
        cy.get('button[type="button"]').contains('Add to cart').click();

        // Aguardar o modal aparecer e clicar em "Continue Shopping"
        cy.get('#cartModal .modal-content', { timeout: 10000 }).should('be.visible');
        cy.get('#cartModal button').contains('Continue Shopping').click();

        // Voltar para home
        cy.get('a[href="/"]').first().click();

        // Ir ao carrinho
        cy.get('li a[href="/view_cart"]').click();

        // Validar carrinho
        cy.url().should('include', '/view_cart');
        cy.contains('Shopping Cart').should('be.visible');

        // Verificar se há produtos no carrinho
        cy.get('#cart_info_table tbody tr').should('have.length.at.least', 1);

        // Proceed to Checkout
        cy.get('a.check_out').contains('Proceed To Checkout').click();

        // Verificar telas
        cy.contains('Address Details').should('be.visible');
        cy.contains('Review Your Order').should('be.visible');

        // Comentário
        cy.get('textarea[name="message"]').type('Pedido gerado automaticamente pelo teste.');

        cy.get('a.btn-default.check_out').click();

        // Preencher cartão
        cy.get('input[name="name_on_card"]').type(`${firstName} ${lastName}`);
        cy.get('input[name="card_number"]').type('4111111111111111');
        cy.get('input[name="cvc"]').type('123');
        cy.get('input[name="expiry_month"]').type('12');
        cy.get('input[name="expiry_year"]').type('2030');

        // Confirmar pagamento
        cy.get('#submit').click();

        // Verificar sucesso
        cy.contains('Order Placed!',)
            .should('be.visible');

        //Deletar conta
        cy.get('a[href="/delete_account"]').click();

        // Confirmar exclusão
        cy.contains('Account Deleted!').should('be.visible');
        cy.get('[data-qa="continue-button"]').click();
    });

});
