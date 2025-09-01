/**
 * AdminLTE Demo Menu
 * ------------------
 * You should not use this file in production.
 * This file is for demo purposes only.
 */

/* eslint-disable camelcase */

(function ($) {
  'use strict'

  const urlParams = new URLSearchParams(window.location.search);
  const _lang = ['kh', 'en']
  const _color = {
    primary: "rgb(27, 88, 117)",
    light: "rgb(64, 149, 191)",
    success: "rgb(34, 197, 94)",
    warning: "rgb(251, 161, 30)",
    error: "rgb(239, 68, 68)",
    grid: "rgba(27, 88, 117, 0.1)",
  }
  $(function () {
    // Document on ready
    _initSortTable();
    // Fill zero null
    _fillZeroNull();
    // Init chart
    _initChart();
    // _testChart();
    _switchLanguage(urlParams.get('lang'));
  });

  $("body").on('click', "th[data-sortable='true']", function (e) {
    e.preventDefault();
    let _sort = $(this).attr('data-sorted');
    let _node = $(this).attr('data-node');
    let _type = $(this).attr('data-type');
    let _table = $(this).closest('table');

    if (typeof _sort === 'undefined' || _sort === null || _sort === '') {
      _sort = 'asc';
    }
    else if (_sort === 'desc') {
      _sort = 'asc';
    } else {
      _sort = 'desc';
    }

    if (typeof _node === 'undefined' || _node === null || _node === '') {
      return;
    }

    if (typeof _type === 'undefined' || _type === null || _type === '') {
      _type = 'string';
    }

    _sortTable(_table, _node, _sort, _type, 150);

  });

  $("[data-role='control-sidebar-item']").on('click', function (e) {
    e.preventDefault();
    const filter = $(this).data('value');
    _setFilter(filter);
  });

  // Function
  function _initSortTable() {
    $('table[init-sort="true"]').each(function (index, element) {
      // Get the table element
      const _table = $(element);
      const _sorted = $(_table).attr('aria-sorted');
      const _sortNode = $(_table).attr('aria-sort-node');
      const _sortType = $(_table).attr('aria-sort-type');
      if (typeof _sortNode !== 'undefined' && _sortNode !== null && _sortNode !== '') {
        _sortTable(_table, _sortNode, _sorted, _sortType, 0);
      }
    });
  }

  function _sortTable(_table, _node, _order, _type, _fade = 0) {
    // Sort the table rows based on the specified node and order
    if (typeof _table === 'undefined' || _table === null) {
      return;
    }
    // Setup attributes for table
    $(_table).children('thead').find('th').removeAttr('data-sorted');
    $(_table).children('thead').find('th[data-node="' + _node + '"]').attr('data-sorted', _order);
    $(_table).attr('aria-sorted', _order);
    $(_table).attr('aria-sort-node', _node);
    $(_table).attr('aria-sort-type', _type);

    // Get parent node
    _type = _type.toLowerCase();
    const _parentNode = $(_table).children('tbody').children('tr').children('td[data-node$="' + _node + '"]');
    let _orderingData = [];
    $(_parentNode).each(function (index, element) {
      const _value = $(element).attr('data-value');
      const _row = $(element).closest('tr');
      const _key = $(_row).attr('data-key');
      let _index = $(_row).attr('data-index');
      const _child = $(_table).children('tbody').children('tr.expandable-body[data-key="' + _key + '"]');
      if (typeof _child !== 'undefined' && _child !== null && _child.length > 0) {
        const _childTable = $(_child).children('td').find('table:first');
        if (typeof _childTable !== 'undefined' && _childTable !== null && _childTable.length > 0) {
          _sortTable(_childTable, _node, _order, _type, 0);
        }
      }

      if (typeof _index === 'undefined' || _index === null || _index === '') {
        _index = 0;
      }
      else {
        _index = parseInt(_index);
      }

      _orderingData.push({
        key: _key,
        value: _value,
        row: _row,
        child: typeof _child !== 'undefined' && _child !== null ? _child : null,
        idx: _index
      });
    });

    // Sort the ordering data based on the value
    let numberTypes = ['number', 'currency', 'khr', 'usd', 'percent', 'int', 'float', 'double'];
    if (numberTypes.includes(_type)) {
      if (_order === 'asc') {
        _orderingData = _orderingData.sort(function (a, b) {
          return parseFloat(a.value) - parseFloat(b.value);
        });
      }
      else {
        _orderingData = _orderingData.sort(function (a, b) {
          return parseFloat(b.value) - parseFloat(a.value);
        });
      }
    } else {
      if (_order === 'asc') {
        _orderingData = _orderingData.sort(function (a, b) {
          return a.value.localeCompare(b.value);
        });
      }
      else {
        _orderingData = _orderingData.sort(function (a, b) {
          return b.value.localeCompare(a.value);
        });
      }
    }
    // Sort by idx
    _orderingData = _orderingData.sort(function (a, b) {
      return a.idx - b.idx;
    });
    var $tbody = $(_table).children('tbody');
    if (_fade <= 0) {
      $tbody.empty();
      $.each(_orderingData, function (index, element) {
        $tbody.append(element.row);
        if (element.child !== null) {
          $tbody.append(element.child);
        }
      });
    }
    else {
      $tbody.fadeOut(_fade, function () {
        $tbody.empty();
        $.each(_orderingData, function (index, element) {
          $tbody.append(element.row);
          if (element.child !== null) {
            $tbody.append(element.child);
          }
        });
        $tbody.fadeIn(_fade);
      });
    }

    // // Clear the table body
    // $(_table).children('tbody').empty();
    // // Append the sorted rows back to the table body
    // $.each(_orderingData, function (index, element) {
    //   $(_table).children('tbody').append(element.row);
    //   if (element.child !== null) {
    //     $(_table).children('tbody').append(element.child);
    //   }
    // });
  }

  function _fillZeroNull() {
    const _zero = ['0', '0.0', '0.00'];
    const _fill = '-';
    _zero.forEach(function (item) {
      $('table.td-zero-null').find('td[data-value="' + item + '"] > span').html(_fill);
      $('table.td-zero-null').find('td[data-value="' + item + '"]').attr('data-type', 'string');
      $('table.td-zero-null').find('td[data-value="' + item + '"]').removeClass('changed-icon').removeClass('changed-color').removeClass('value-between')
    });
  }

  let currentLang = '';
  function _switchLanguage(lang) {
    // Switch language function
    if (typeof lang === 'undefined' || lang === null || lang === '') {
      lang = 'kh';
    }
    lang = lang.toLowerCase();
    // Set the language in the URL
    urlParams.set('lang', lang);
    const newUrl = window.location.pathname + '?' + urlParams.toString();
    window.history.pushState({ path: newUrl }, '', newUrl);
    currentLang = lang;

    if (lang == 'kh') {
      $('html').attr('lang', 'km');
      $('body').addClass('kh-siemreap');
    }
    else {
      $('html').attr('lang', 'en');
      $('body').removeClass('kh-siemreap');
    }
    // Hide other languages
    _lang.forEach(function (item) {
      if (item !== lang) {
        $('[data-lang="' + item + '"]').hide();
      }
    });
    $('body').removeClass('d-none');
    _setFilter(urlParams.get('filter'));
    _hidePreloader();
  }

  function _setFilter(filter) {
    if ($("[data-filter]").length <= 0) {
      return;
    }
    if (typeof filter === 'undefined' || filter === null) {
      filter = 'all';
    }
    filter = filter.toLowerCase();
    // Set the filter in the URL
    urlParams.set('filter', filter);
    const newUrl = window.location.pathname + '?' + urlParams.toString();
    window.history.pushState({ path: newUrl }, '', newUrl);

    $('[data-lang="' + currentLang + '"][data-filter]').fadeOut(50);
    $('[data-lang="' + currentLang + '"][data-filter="' + filter + '"]').fadeIn(150);
    $('[data-lang="' + currentLang + '"][data-filter="' + filter.toUpperCase() + '"]').fadeIn(150);

    $("[data-role='control-sidebar-item']").removeClass('active');

    $("[data-role='control-sidebar-item'][data-value='" + filter + "']").addClass('active');
    $("[data-role='control-sidebar-item'][data-value='" + filter.toUpperCase() + "']").addClass('active');
    if($('body').hasClass('control-sidebar-slide-open')){
      $('[data-widget="control-sidebar"]').trigger('click');
    }

    let filterHtml = $("[data-value='"+ filter +"'][data-role='control-sidebar-item']");
    if(filterHtml.length <= 0)
    {
      filterHtml = $("[data-value='"+ filter.toUpperCase() +"'][data-role='control-sidebar-item']");
    }
    if(filterHtml.length > 0)
    {
      $("[data-role='filter'][data-filter='all']").html(" [" + filterHtml.find("p").html() + "]");
    }
    else{
      $("[data-role='filter'][data-filter='all']").html("");
    }
  }

  function _initChart() {
    let _chart = $("div[data-role='chart-container']");
    if (typeof _chart === 'undefined' || _chart === null || _chart.length <= 0) {
      return;
    }
    _chart.each(function (index, element) {
      const id = $(element).attr('id');
      let _chartConfig = $(`#${id}-config`).val();
      if (typeof _chartConfig === 'undefined' || _chartConfig === null || _chartConfig === '') {
        return;
      }
      _chartConfig = JSON.parse(_chartConfig);
      if (typeof _chartConfig === 'undefined' || _chartConfig === null) {
        return;
      }
      const ctx = $(`#${id}-canvas`).get(0).getContext('2d');
      if (typeof ctx === 'undefined' || ctx === null) {
        return;
      }

      Object.keys(_chartConfig.options.scales).forEach(function (scale) {
        if (typeof _chartConfig.options.scales[scale].grid === 'undefined' || _chartConfig.options.scales[scale].grid === null) {
          _chartConfig.options.scales[scale].grid = {};
        }
        let _g_color = _color.grid;
        if (typeof _chartConfig.options.scales[scale].grid.color !== 'undefined' && _chartConfig.options.scales[scale].grid.color !== null) {
          if (_chartConfig.options.scales[scale].grid.color in _color) {
            _chartConfig.options.scales[scale].grid.color = _color[_chartConfig.options.scales[scale].grid.color];
            _g_color = _chartConfig.options.scales[scale].grid.color;
          }
          else {
            _chartConfig.options.scales[scale].grid.color = _chartConfig.options.scales[scale].grid.color;
            _g_color = _chartConfig.options.scales[scale].grid.color;
          }
        }
        else {
          _chartConfig.options.scales[scale].grid.color = _color.grid;
          _g_color = _color.grid;
        }

        if (typeof _chartConfig.options.scales[scale].grid.color === 'undefined' || _chartConfig.options.scales[scale].grid.color === null) {
          _chartConfig.options.scales[scale].grid.color = _color.grid;
        }
        if (typeof _chartConfig.options.scales[scale].zeroline !== 'undefined' && _chartConfig.options.scales[scale].zeroline !== null) {
          let _c = _color.primary;
          if (typeof _chartConfig.options.scales[scale].zerolineColor !== 'undefined' && _chartConfig.options.scales[scale].zerolineColor !== null) {
            _c = _chartConfig.options.scales[scale].zerolineColor;
            if (_c in _color) {
              _c = _color[_c];
            }
            else {
              _c = _chartConfig.options.scales[scale].zerolineColor;
            }
          }
          if (typeof _chartConfig.options.scales[scale].grid === 'undefined' || _chartConfig.options.scales[scale].grid === null) {
            _chartConfig.options.scales[scale].grid = {};
          }
          _chartConfig.options.scales[scale].grid.color = function (context) {
            return context.tick.value === 0 ? _c : _g_color;
          }
          if (_chartConfig.options.scales[scale].zeroline === 'dashed') {
            if (typeof _chartConfig.options.scales[scale].border === 'undefined' || _chartConfig.options.scales[scale].border === null) {
              _chartConfig.options.scales[scale].border = {};
            }

            _chartConfig.options.scales[scale].border.dash = function (context) {
              return context.tick.value === 0 ? [3, 3] : [];
            }
          }
        }
      });
      // Set the canvas size
      let _chart = new Chart(ctx, _chartConfig);
    });
  }

  function _hidePreloader() {
    setTimeout(function () {
      // Hide the preloader after 1 second
      const $preloader = $('.preloader');
      if ($preloader.length > 0) {
        $preloader.fadeOut("slow", function () {
          _resizeTd();
        });
        // setTimeout(function () {
        //   $preloader.children().hide();
        // }, 200);
      }
    }, 500);
  }

  function _resizeTd() {
    // Dynamically add col and colgroup to each table based on the class of first row
    $('table.same-width').each(function (index, element) {
      const $table = $(element);
      const $firstRow = $table.find('tbody tr:first');
      if ($firstRow.length <= 0) {
        return;
      }
      const $cols = $firstRow.children('td');
      if ($cols.length <= 0) {
        return;
      }
      // Remove existing colgroup
      $table.children('colgroup').remove();
      // Create new colgroup
      const $colgroup = $('<colgroup></colgroup>');
      $cols.each(function (i, col) {
        const className = $(col).attr('class');
        if (typeof className !== 'undefined' && className !== null && className !== '') {
          $colgroup.append(`<col class="${className}">`);
        } else {
          $colgroup.append('<col>');
        }
      });
      $table.prepend($colgroup);
      $table.addClass('table-fixed');
    });
  }

  $(document).on('click', function (event) {
    const $controlSidebar = $('.control-sidebar');
    const $toggleButton = $('[data-widget="control-sidebar"]');

    // If sidebar is open and click is outside sidebar & toggle button
    if (
      $('body').hasClass('control-sidebar-slide-open') &&
      !$controlSidebar.is(event.target) &&
      $controlSidebar.has(event.target).length === 0 &&
      !$toggleButton.is(event.target) &&
      $toggleButton.has(event.target).length === 0
    ) {
      // Close the control sidebar
      $toggleButton.trigger('click');
    }
  });
})(jQuery)
