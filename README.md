# TimeSeriesVisualizer
An application for visualizing time series data and how a classification model performs on such data.  
Example Screenshots:  

![alt text](https://github.com/MattScho/TimeSeriesVisualizer/blob/master/AllMetrics.PNG "All Metrics")  
  

![alt text](https://github.com/MattScho/TimeSeriesVisualizer/blob/master/EncoderAndPerformance.PNG "Encoder and Matrices")

Usage:  
1. Upload a csv of your time series with the columns to the preprocessing directory  
   * recNum - record number of the individual time series  
   * stream - the encoded time series  
   * label - true label of time series  
   * prediction - predicted label of time series  
2. Upload a text file with a python dictionary of the encoder to the preprocessing directory  
   * {“True Value 1”:“encoding 1”, “True Value 2”:“encoding 2”,… “True Value n”:“encoding n”}  
3. Run encodingCreator.py and tsToJSON.py then move the generated files to app/static/data/  
4. Run start.py and visit localhost:5000!  
