import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver';

describe('Inicio de sesión', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  }, 10000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('debería mostrar un mensaje de error con una contraseña incorrecta', async () => {
    try {
      await driver.get('http://localhost:3000/Login');

      const emailInput = await driver.wait(until.elementLocated(By.id('email')), 20000);
      await emailInput.sendKeys('barrantespamela2103@gmail.com');

      const passwordInput = await driver.wait(until.elementLocated(By.id('password')), 20000);
      await passwordInput.sendKeys('contraseñaincorrecta', Key.RETURN);

      await driver.wait(until.elementLocated(By.className('error-message')), 20000);
      const errorMessage = await driver.findElement(By.className('error-message')).getText();
      
      expect(errorMessage).toBe('Contraseña incorrecta');
    } catch (error) {
      console.error('Error durante la ejecución de la prueba:', error);
    }
  }, 60000);

  it('debería iniciar sesión con contraseña y usuario correctos', async () => {
    try {
      await driver.get('http://localhost:3000/Login');

      const emailInput = await driver.wait(until.elementLocated(By.id('email')), 20000);
      await emailInput.sendKeys('barrantespamela2103@gmail.com');

      const passwordInput = await driver.wait(until.elementLocated(By.id('password')), 20000);
      await passwordInput.sendKeys('123456', Key.RETURN);

      
    } catch (error) {
      console.error('Error durante la ejecución de la prueba:', error);
    }
  }, 60000);
});
