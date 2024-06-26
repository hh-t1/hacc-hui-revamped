import { Selector } from 'testcafe';
import {adminCredentials, compliantParticipantCredentials, signInAs} from "./_helpers";

class SuggestToolSkillTest {
  constructor() {
    this.pageId = '#suggest-tool-skill';
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
    await signInAs(tc, compliantParticipantCredentials);
    await tc.navigateTo('/#/suggest-tool-skill');
    await this.isDisplayed(tc);
  }

  // IN CASE YOUR TEST WANTS CREDENTIALS, YOU CAN DO SOMETHING LIKE THIS
  // /** @type {(tc: TestController, creds: Credentials) => void} */
  // async test(tc, creds) {
  //   // await tc.debug();
  //   await this.isDisplayed(tc);
  //   await this.somethingThatNeedsCreds(tc, creds);
  // }
}

export const suggestToolSkillTest = new SuggestToolSkillTest();
