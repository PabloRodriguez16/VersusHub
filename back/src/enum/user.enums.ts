export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export enum onTopWithTeam {
  TOPONEAMATEUR = 'topOneAmateur',
  TOPTWOAMATEUR = 'topTwoAmateur',
  TOPTHREEAMATEUR = 'topThreeAmateur',
  TOPONEVERSUSHUB = 'topOneVersusHub',
  TOPTWOVERSUSHUB = 'topTwoVersusHub',
  TOPTHREEVERSUSHUB = 'topThreeVersusHub',
  NODATA = 'noData',
}

export enum onTopSolo {
  TOPONEAMATEUR = 'topOneAmateur',
  TOPTWOAMATEUR = 'topTwoAmateur',
  TOPTHREEAMATEUR = 'topThreeAmateur',
  TOPONEVERSUSHUB = 'topOneVersusHub',
  TOPTWOVERSUSHUB = 'topTwoVersusHub',
  TOPTHREEVERSUSHUB = 'topThreeVersusHub',
  NODATA = 'noData',
}

export enum RoleOnTournament {
  TEAMLEADER = 'teamLeader',
  PLAYER = 'player',
}

export enum NotificationType {
  TEAM_INVITATION = 'teamInvitation',
  TEAM_INVITATION_REJECT = 'teamInvitationReject',
  TEAM_INVITATION_ACCEPT = 'teamInvitationAccept',
  TEAM_JOIN_REQUEST = 'teamJoinRequest',
  TEAM_JOIN_REQUEST_REJECT = 'teamJoinRequestReject',
  TOURNAMENT_INVITATION = 'tournamentInvitation',
  TOURNAMENT_INVITATION_REJECT = 'tournamentInvitationReject',
  TOURNAMENT_INVITATION_ACCEPT = 'tournamentInvitationAccept',
  TOURNAMENT_WINNER = 'tournamentWinner',
}
