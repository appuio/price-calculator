# Appuio Price Calculator

## HTML Usage

The Appuio Range Slider can be used without direct JavaScript usage.
Add the `data-appuio-range-slider` to your element and you're done.

The following options through data attributes are supported:
- `data-appuio-value-memory` (default: '.memoryvalue'):
    Element to update the current memory amount
- `data-appuio-value-cpu` (default: '.cpuvalue'):
    Element to update the current cpu amount
- `data-appuio-price-per-day` (default: '.pricevalueperday'):
    Element to update the current price per day
- `data-appuio-price-per-month` (default: '.pricevaluepermonth'):
    Element to update the current price per month
- `data-appuio-dedicated-info` (default: '.offers-package-dedicated-info'):
    Element to show once we recommend a dedicated appuio instance
- `data-appuio-initial-data-source` (default: 'appuio'):
    The default data source to use
- `data-appuio-data-source-switch` (default: '[name="appuio-price-source"]'):
    Elements (radios or select) to select the data source
- `data-appuio-data-source` (default: '.appuio-price-source'):
    Class prefix to show/hide the current price source
- `data-appuio-banner` (default: '.offers-package'):
    Elements to toggle the active state based on slider position

### HTML Example:
```
<input
  data-appuio-range-slider
  data-appuio-value-memory=".memoryvalue"
  data-appuio-value-cpu=".cpuvalue"
  type="range"
  min="512"
  max="20480"
  step="512">
```

## JavaScript Usage:
If you need to configure further values or need a different element
you can use the jQuery API:
  `jQuery('input.appuio-slider').appuioRangeSlider(options)`

### Options:
- `updateState` (default: function):
    The function to call and update the DOM each time the slider
    value changes
- `initialDataSource` (default: 'appuio'):
    The data source to use
- `dataSourceSwitch` (default: '[name="appuio-price-source"]'):
    Elements (radios or select) to select the data source
- `valueDataSource` (default: '.appuio-price-source'):
    Class prefix to show/hide the current price source
- `min` (default: 512):
    The minimal value to select
- `max` (default: 20480):
    The maximum value to select
- `step` (default: 512):
    The value which the range input uses for each step
- `valueMemory` (default: '.memoryvalue'):
    Element to update the current memory amount
- `valueCpu` (default: '.cpuvalue'):
    Element to update the current cpu amount
- `valuePricePerDay` (default: '.pricevalueperday'):
    Element to update the current price per day
- `pricePerMonth` (default: '.pricevaluepermonth'):
    Element to update the current price per month
- `dedicatedInfo` (default: '.offers-package-dedicated-info'):
    Element to show once we recommend a dedicated appuio instance
- `banners` (default: see BANNERS constant):
    The different banner sizes to toggle active state.
- `banner` (default: '.offers-package'):
    Elements to toggle the active state based on slider position
