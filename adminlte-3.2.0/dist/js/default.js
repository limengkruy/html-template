/**
 * AdminLTE Demo Menu
 * ------------------
 * You should not use this file in production.
 * This file is for demo purposes only.
 */

/* eslint-disable camelcase */

(function ($) {
  'use strict'

  $(function () {
    // Document on ready
    _initSortTable();
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
      const _child = $(_table).children('tbody').children('tr.expandable-body[data-key="' + _key + '"]');
      if (typeof _child !== 'undefined' && _child !== null && _child.length > 0) {
        const _childTable = $(_child).children('td').find('table:first');
        if (typeof _childTable !== 'undefined' && _childTable !== null && _childTable.length > 0) {
          _sortTable(_childTable, _node, _order, _type, 0);
        }
      }

      _orderingData.push({
        key: _key,
        value: _value,
        row: _row,
        child: typeof _child !== 'undefined' && _child !== null ? _child : null
      });
    });

    // Sort the ordering data based on the value
    let numberTypes = ['number', 'currency', 'khr', 'usd', 'percent','int', 'float', 'double'];
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


})(jQuery)
