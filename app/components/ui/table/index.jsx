import './styles.scss';

// import local files
import Body from './body';
import Caption from './caption';
import Cell from './cell';
import Footer from './footer';
import Head from './head';
import Header from './header';
import Row from './row';
import Container from './container';

const Table = {
  Body,
  Caption,
  Cell,
  Footer,
  Head,
  Header,
  Row,
  Container,
};

export { Body, Caption, Cell, Footer, Head, Header, Row, Container };

Table.displayName = 'Table';

export default Table;
