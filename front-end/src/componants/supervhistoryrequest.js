import Table from 'react-bootstrap/Table';
export const SupervisorRequest = (items) => {
  
  return (
    <div className="lol">
      <Table striped bordered hover  >
      <tbody>
        <tr>
        <td style={{width:'  7cm'}}>{items.name}</td>
    <td style={{width:'  7cm'}}>{items.id}</td>
    <td style={{width:'  7cm'}}>{items.warehouseId}</td>
    <td style={{width:'  7cm'}}>{items.stock}</td>
    <td style={{width:'  7cm'}}>{items.request}</td>
    <td style={{width:'  7cm'}}>{items.status}</td>
        </tr>
        
      </tbody>
    </Table>
    </div>
  );
};
