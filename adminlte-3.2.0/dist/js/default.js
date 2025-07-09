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
          return a.value - b.value;
        });
      }
      else {
        _orderingData = _orderingData.sort(function (a, b) {
          return b.value - a.value;
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

  function _switchLanguage(lang) {
    // Switch language function
    if (typeof lang === 'undefined' || lang === null || lang === '') {
      lang = 'kh';
    }
    // Set the language in the URL
    urlParams.set('lang', lang);
    const newUrl = window.location.pathname + '?' + urlParams.toString();
    window.history.pushState({ path: newUrl }, '', newUrl);

    if (lang == 'kh') {
      $('html').attr('lang', 'km');
      $('body').addClass('siemreap-regular');
    }
    else {
      $('html').attr('lang', 'en');
      $('body').removeClass('siemreap-regular');
    }
    // Hide other languages
    _lang.forEach(function (item) {
      if (item !== lang) {
        $('[data-lang="' + item + '"]').hide();
      }
    });
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
      // Set the canvas size
      let _chart = new Chart(ctx, _chartConfig);
    });
  }


})(jQuery)
