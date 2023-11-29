import { Meteor } from 'meteor/meteor';
import { ChallengeInterests } from '../../api/challenge/ChallengeInterestCollection';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { Teams } from '../../api/team/TeamCollection';
import { MinorParticipants } from '../../api/user/MinorParticipantCollection';
import { WantsToJoin } from '../../api/team/WantToJoinCollection';
import { TeamInvitations } from '../../api/team/TeamInvitationCollection';
import { LeavingTeams } from '../../api/team/LeavingTeamCollection';
import { SlackUsers } from '../../api/slackbot/SlackUserCollection';
import { Suggestions } from '../../api/suggestions/SuggestionCollection';
import { UserInteractions } from '../../api/user/UserInteractionCollection';
import { Participants } from '../../api/user/ParticipantCollection';

Meteor.methods({
  haccReset: function () {
    const clearCollection = (baseCollection) =>
      baseCollection.find().forEach((doc) => baseCollection.removeIt(doc._id));

    const resetChallenges = () => {
      clearCollection(ChallengeInterests);
      clearCollection(Challenges);
    };

    const resetTeams = () => {
      clearCollection(Teams);
    };

    const resetParticipants = () => {
      clearCollection(MinorParticipants);
      clearCollection(WantsToJoin);
      clearCollection(TeamInvitations);
      clearCollection(LeavingTeams);
      clearCollection(SlackUsers);
      clearCollection(Suggestions);
      clearCollection(UserInteractions);
      const participantUsernames = new Set(
        Participants.find({}, {}).map((doc) => doc.username),
      );
      clearCollection(Participants);
      Meteor.users.find().forEach((user) => {
        if (participantUsernames.has(user.username)) {
          Meteor.users.remove(user._id);
        }
      });
    };

    resetParticipants();
    resetTeams();
    resetChallenges();
  },
});
