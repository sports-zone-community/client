export interface SearchResultModel {
  name: string;
  image: string;
  type: 'user' | 'group';
}

export interface SearchResultProps {
  result: SearchResultModel;
  onClick: () => void;
}
