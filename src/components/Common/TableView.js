import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {isNullOrUndefined} from 'util';
import { Link as RouterLink} from 'react-router-dom';
import Link from '@mui/material/Link';

function TableView(props) {
    const {rows, columns} = props;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns ?
                columns.map((col, i) => {
                    return(
                        <TableCell key={i}>{col.label}</TableCell>
                    )
                })
            : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows ?
            rows.map((row, i) => {
                return (
                  <TableRow>
                    {
                      columns.map((col, colIndex) => {
                        return (
                                <TableCell key={colIndex}>
                                  {col.name === 'id' ?
                                    <Link to={`/admin/posts/edit/${row[col.name]}`} component={RouterLink}>{row[col.name]}</Link>
                                  : row[col.name]
                                }
                                    
                                </TableCell>
                            )
                      })
                    }
                  </TableRow>  
                )
              })
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableView;
