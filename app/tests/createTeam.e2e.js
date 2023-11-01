import { Selector } from 'testcafe';
import { adminCredentials, signInAs } from './_helpers';

class CreateTeamTest {
  constructor() {
    this.pageId = '#create-team';
    this.pageSelector = Selector(this.pageId);
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async isDisplayed(tc) {
    await tc.expect(this.pageSelector.exists).ok();
    await tc.expect(this.pageSelector.visible).ok();
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async test(tc) {
    // await tc.debug();
    await tc.navigateTo('/#/create-team');
    await this.isDisplayed(tc);
    await signInAs(tc, adminCredentials);
  }
}

export const createTeamTest = new CreateTeamTest();
