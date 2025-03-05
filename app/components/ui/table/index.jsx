import './styles.scss';

// import local files
import Body from './body';
import Caption from './caption';
import Cell from './cell';
import Footer from './footer';
import Head from './head';
import Header from './header';
import Row from './row';
import TableContainer from './table';

const Table = {
  Body,
  Caption,
  Cell,
  Footer,
  Head,
  Header,
  Row,
  Table: TableContainer,
};

export {
  Body,
  Caption,
  Cell,
  Footer,
  Head,
  Header,
  Row,
  TableContainer as Table,
};

Table.displayName = 'Table';

export default Table;
