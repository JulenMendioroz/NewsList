export enum NewsDisplayType {
  list,
  card
}

export interface INewsListProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  listGuid: string;
  displayType: NewsDisplayType
}
