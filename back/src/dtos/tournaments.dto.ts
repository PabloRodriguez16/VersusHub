export class createTournamentsDto {
  name: string;
  description: string;
  gameName: string;
  startDate: Date;
  endDate: Date;
}

export class tournamentTeamsNotificationDto {
  tournamentId: string;
  teamId: string;
}

export class tournamentTeamsDto {
  notificationId: string;
  tournamentId: string;
  teamId: string;
  player1Id: string;
  player2Id: string;
  player3Id: string;
  player4Id: string;
}
