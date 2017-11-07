self.addEventListener('DOMContentLoaded', function() {
  var jQuery = self.jQuery;
  var ONE_MONTH = 30.5;
  var SIZES = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  var BANNERS = [
    { name: 'small', size: 0 },
    { name: 'medium', size: 1024 * 2 },
    { name: 'large', size: 1024 * 6 },
    { name: 'x-large', size: 1024 * 10 }
  ];

  function AppuioRangeSlider(element, options) {
    this.element = element;
    this.language = options.language;
    this.calcPrice = options.calcPrice;
    this.calcCpu = options.calcCpu;
    this.banners = options.banners.slice();
    this.banner = options.banner;
    this.max = options.max;
    this.min = options.min;
    this.step = options.step;
    this.valueMemory = options.valueMemory;
    this.valueCpu = options.valueCpu;
    this.valuePricePerDay = options.valuePricePerDay;
    this.valuePricePerMonth = options.valuePricePerMonth;
    this.dedicatedInfo = options.dedicatedInfo;
    this.updateState = options.updateState.bind(this);
    this.oninput = this.oninput.bind(this);

    this.init();
  }

  AppuioRangeSlider.prototype.init = function init() {
    this.element.max = this.max;
    this.element.min = this.min;
    this.element.step = this.step;
    this.updateState(this.element.value);
    this.banners.sort(function(a, b) {
      return b.size - a.size;
    });
    jQuery(this.element).on('input', this.oninput);
  };

  AppuioRangeSlider.prototype.oninput = function oninput(e) {
    this.updateState(e.target.value);
  };

  function updateState(value) {
    var valueMem = jQuery(this.valueMemory);
    var valueCpu = jQuery(this.valueCpu);
    var valuePricePerDay = jQuery(this.valuePricePerDay);
    var valuePricePerMonth = jQuery(this.valuePricePerMonth);
    var dedicatedInfo = jQuery(this.dedicatedInfo);
    var price = this.calcPrice(value);

    valuePricePerDay.text(formatPrice(this.language, price));
    valuePricePerMonth.text(formatPrice(this.language, price * ONE_MONTH));
    valueMem.text(formatUnit(value));
    valueCpu.text(this.calcCpu(value));

    dedicatedInfo.toggle(value > 10000);
    updateActiveBanner.call(this, value);
  }

  function updateActiveBanner(value) {
    var banner = this.banners.find(function(banner) {
      return banner.size <= value;
    });

    if (banner === undefined) {
      return;
    }

    jQuery(this.banner + '.active').removeClass('active');
    jQuery(this.banner + '--' + banner.name).addClass('active');
  }

  function formatPrice(language, price) {
    return price.toLocaleString(language, {
      minimumFractionDigits: 2
    });
  }

  function calcPrice(memoryvalue) {
    return memoryvalue / 512 * 0.92;
  }

  function calcCpu(memoryvalue) {
    return 500 + (memoryvalue / 512 - 1) * 200;
  }

  function formatUnit(value) {
    return bytesToSize(value * Math.pow(1024, 2), 1);
  }

  function getDocumentLanguage() {
    var lang = document.documentElement.lang;

    switch (lang) {
      case 'de':
      case 'fr':
        return lang + '-CH';
      default:
        return lang;
    }
  }

  function bytesToSize(bytes, precision) {
    if (!bytes) return '0 Byte';
    if (bytes === 1) return '1 Byte';
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(precision) + ' ' + SIZES[i];
  }

  var DEFAULT_OPTIONS = {
    updateState: updateState,
    min: 512,
    max: 20480,
    step: 512,
    language: getDocumentLanguage(),
    calcPrice: calcPrice,
    calcCpu: calcCpu,
    valueMemory: '.memoryvalue',
    valueCpu: '.cpuvalue',
    valuePricePerDay: '.pricevalueperday',
    valuePricePerMonth: '.pricevaluepermonth',
    dedicatedInfo: '.offers-package-dedicated-info',
    banners: BANNERS,
    banner: '.offers-package'
  };

  function getAttributeOptions(element) {
    var $element = jQuery(element);

    return {
      valueMemory: $element.data('appuio-value-memory'),
      valueCpu: $element.data('appuio-value-cpu'),
      valuePricePerDay: $element.data('appuio-value-price-per-day'),
      valuePricePerMonth: $element.data('appuio-value-price-per-month'),
      dedicatedInfo: $element.data('appuio-dedicated-info'),
      bannerClass: $element.data('appuio-banner'),
      max: element.max,
      min: element.min,
      step: element.step
    };
  }

  jQuery.fn.appuioRangeSlider = function(options) {
    this.each(function() {
      new AppuioRangeSlider(
        this,
        jQuery.extend(
          {},
          DEFAULT_OPTIONS,
          options || {},
          getAttributeOptions(this)
        )
      );
    });
  };

  jQuery('[data-appuio-range-slider]').appuioRangeSlider();
});
