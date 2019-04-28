import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

function PageNotFound() {
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid style={{textAlign: 'center'}}>
        <Typography variant="h2" gutterBottom>
          Page not found
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Sorry, the page you are looking for could not be found.
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageNotFound;
