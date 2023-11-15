import { Selector } from 'testcafe';
import { compliantParticipantCredentials, signInAs } from './_helpers';

class TeamInvitationsPageTest {
  constructor() {
    this.pageId = '#team-invitations-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async isDisplayed(tc) {
    await tc.expect(this.pageSelector.exists).ok();
    await tc.expect(this.pageSelector.visible).ok();
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async test(tc) {
    await signInAs(tc, compliantParticipantCredentials);
    await tc.navigateTo('/#/team-invitations');
    await this.isDisplayed(tc);
  }
}

export const teamInvitationsPageTest = new TeamInvitationsPageTest();
