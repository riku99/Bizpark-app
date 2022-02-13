import React from 'react';
import { Box } from 'native-base';
import { NewsGenre } from 'src/generated/graphql';
import { List } from '../../components/NewsList';
import { Indicator } from 'src/components/Indicator';
import { useNews } from 'src/hooks/news';

export const Business = React.memo(() => {
  const { data, infiniteLoad, refresh } = useNews({
    genre: NewsGenre.Business,
  });

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <Box flex={1}>
      <List
        data={data.news.edges}
        refresh={refresh}
        infiniteLoad={infiniteLoad}
      />
    </Box>
  );
});
