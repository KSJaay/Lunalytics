const Item = ({ children, ...props }) => {
  return <li {...props}>{children}</li>;
};

export default Item;
