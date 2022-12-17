import React from "react";
import CardSlider from "./cardslider";
import Nslider from "./nslider";

export default React.memo(function Slider({ movies }) {
  const getMoviesFromRange = (from, to) => {
    return movies.slice(from, to);
  };
  return (
    <div>
      
   {/*   <CardSlider title="Trending this week" data={getMoviesFromRange(0, 20)} />
      <CardSlider title="Top rated Movies" data={getMoviesFromRange(20, 40)} />
      <CardSlider
        title="Popular Romance Flicks"
        data={getMoviesFromRange(40, 60)}
      />
      <CardSlider
        title="Popular Fantasy Movies"
        data={getMoviesFromRange(60, 80)}
      />
      <CardSlider title="Top rated TV" data={getMoviesFromRange(80, 100)} />
      <CardSlider
        title="Popular Crime TV"
        data={getMoviesFromRange(100, 120)}
      />*/}
      <Nslider title="Popular Crime TV"
        data={getMoviesFromRange(100, 120)}/>
    </div>
  );
});
