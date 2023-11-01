import { Selector } from 'testcafe';
import { adminCredentials, signInAs } from './_helpers';

class UpdateMinorParticipantsPageTest {
  constructor() {
    this.pageId = '#update-minor-participants';
    this.pageSelector = Selector(this.pageId);
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async isDisplayed(tc) {
    await tc.expect(this.pageSelector.exists).ok();
    await tc.expect(this.pageSelector.visible).ok();
  }

  // IN CASE YOUR TEST NEEDS TO SIGN IN FIRST, YOU CAN DO SOMETHING LIKE THIS
  /** @type {(tc: TestController) => Promise<void>} */
  async test(tc) {
    // await tc.debug();
    await signInAs(tc, adminCredentials);
    await tc.navigateTo('/#/update-minor-participants');
    await this.isDisplayed(tc);
  }
}

export const updateMinorParticipantsPageTest = new UpdateMinorParticipantsPageTest();
