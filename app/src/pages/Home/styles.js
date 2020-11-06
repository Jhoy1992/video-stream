import styled from 'styled-components';

export const Container = styled.div`
  color: #333;
  height: 100vh;
  overflow: auto;
`;

export const Movies = styled.div`
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 320px));
  /* gap: 20px; */
  justify-content: center;
`;

export const Movie = styled.div`
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  box-shadow: 3px 3px 7px 0px rgba(0, 0, 0, 0.5);

  margin: 10px;

  &:hover {
    border: 2px solid #20bd4a;
    cursor: pointer;
  }

  img {
    max-width: 100%;
    object-fit: cover;
  }
`;

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  text-align: center;
  padding: 8px 0;
  background-color: #ddd;
  font-weight: bold;
  padding: 5px;

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  svg {
    color: ${props => (props.hasSubs ? '#21c41b' : '#000')};
  }
`;
