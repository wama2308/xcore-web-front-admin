import ws from './ws';

const business = ws
  .subscribe('business')

export {
  ws,
  business
};