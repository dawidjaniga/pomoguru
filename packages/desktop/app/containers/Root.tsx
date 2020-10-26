import React from 'react';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import Routes from '../Routes';
import 'antd/dist/antd.css';

type Props = {
  history: History;
};

const Root = ({ history }: Props) => (
      <Routes />
);

export default hot(Root);
