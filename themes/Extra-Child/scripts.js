

var document_ready = function($){
        //WooCommerce Review Plugin Updates
        $('.comment-form-cookies-consent').remove();
        $('.ivole-upload-local-images').remove();
    
        //Remove "Name" placeholder and match formatting to other fields
        setTimeout(function(){
            $('input#author').val("");
        }, 200);
      
        $('.comment-form-author > label').css('display', 'block');
        $('.comment-form-author > label').text('Name *');
    
        $('body').click(function() {
            setTimeout(function(){
                if ($('input#author').val() == "Name"){
                    $('input#author').val("");
                }
            }, 0);
        });
    
        //We want name to be required, but not email
        $('form#commentform').submit(function(e) {
            if ( $('input#author').val().length < 1 ){
                alert('Please include a name with your review');
                e.preventDefault(e);
            }
        });

        $('.filter-select').on('change' , function(){
            var val = this.value;
            var elem = this;
            if ( val !== '' ){
                $(elem).css('background-color', '#539cbb');
            }
            else{
                $(elem).css('background-color', '#416782');
            }
        
        });
    // TODO lazy loading

    var page = 1;

    var posts_per_page = 16;

    var filters = {};

    var total_number_of_posts = 0;

    var $container_container = $('div.filter-container');

    var cat_id = null;

    if ($container_container.length)
    {

        total_number_of_posts = parseInt($container_container.attr('data-found-posts'));

        cat_id = $container_container.attr('data-cat-id');
    }

    window.load_from_ajax = function (params, callback)
    {

        if (!params)
        {

            params = {};
        }

        if (!params.action)
        {

            params.action = 'more_products';
        }

        $.ajax({
            'url' : ajax_object.ajax_url,
            'type' : 'get', //or 'post'
            'data' : params,
            'dataType': 'html',
            'success': function (data)
            {


                callback(null, data);
                
                //Insert search term
                $('.search-text').remove();
                var insert = $('.filters');
                var searchText = $('.filter-search-box').val();
                if ( insert.length > 0 && searchText.length > 0 ) {
                    $('<h4 class="search-text" style="text-align: center; font-weight: normal; text-transform:none; color: #144466; padding: 10px 0 20px 0; font-size: 22px;">Showing search results for <strong>' + searchText + '</strong></h4>').insertAfter(insert);
                }
            },
            'error': function (e)
            {

                console.error(e);

                callback(e);
            }
        });
    };

    function append_for_current_query()
    {

        page += 1;

        var arg_obj = {};

        for (var index in filters)
        {

            arg_obj[index] = filters[index];
        }

        arg_obj['page'] = page;

        arg_obj['posts_per_page'] = posts_per_page;

        arg_obj['no_container'] = 'true';

        arg_obj['cat_id'] = cat_id;

        window.load_from_ajax(arg_obj, function (error, html_resp)
        {

            if (!error)
            {

                var container = $('.container-container .filter-container .more-products-list');

                if (container.length)
                {

                    container.append(html_resp);

                    if ((page * posts_per_page) > total_number_of_posts)
                    {

                        var $more_button = $('.more-button');

                        if ($more_button.length)
                        {

                            $more_button.addClass('hidden');
                        }
                    }
                }
            }
        });
    }

    function reset_for_new_query(new_filters)
    {

        page = 1;

        var arg_obj = {};

        filters = new_filters;

        for (var index in new_filters)
        {

            arg_obj[index] = filters[index];
        }

        arg_obj['page'] = page;

        arg_obj['posts_per_page'] = posts_per_page;

        arg_obj['cat_id'] = cat_id;

        load_from_ajax(arg_obj, function (error, html_resp)
        {

            if (!error)
            {

                var container = $('.container-container');

                if (container.length)
                {

                    container.html(html_resp);

                    var container_filter_container = $('.container-container .filter-container');

                    if (container_filter_container.length)
                    {

                        total_number_of_posts = container_filter_container.attr('data-found-posts');

                        var $more_button = $('.more-button');

                        if (total_number_of_posts <= posts_per_page)
                        {

                            $more_button.addClass('hidden');
                        }

                        else
                        {

                            $more_button.removeClass('hidden');
                        }
                    }
                }
            }
        });

        var clearFilterContainer = $('.clear-individual-filters-container');

        if (clearFilterContainer.length)
        {

            show_clear_buttons(clearFilterContainer);
        }
    }

    function show_clear_buttons(container) {

        var text = '';

        for (var filterKey in filters)
        {

            if (filters[filterKey])
            {

                var filter_values = filters[filterKey].split('|');

                for (var i in filter_values)
                {

                    var filter_value = filter_values[i];

                    if (filter_value)
                    {

                        text += '<div class="clear-filter-button" data-filter-key="' + filterKey + '" data-filter-value="' + filter_value + '">' + filterKey + ': ' + filter_value + '</div>';
                    }
                }
            }
        }

        container.html(text);
    }
    
    var $body = $('body');

    $body.on('click', '.clear-filter-button', function ()
    {

        var $this = $(this);

        var filterKey = $this.attr('data-filter-key');

        var filterValue = $this.attr('data-filter-value');

        if (filterKey === 'title_query')
        {

            filters['title_query'] = '';

            var titleQuery = $('.filter-search-box');

            if (titleQuery.length)
            {

                titleQuery.val('');
            }
        }

        else
        {

            var splitVal = filterValue.split('|');

            var newFilterValue = [];

            for (var index in splitVal)
            {

                if (splitVal[index].toLowerCase().trim() !== filterValue.toLowerCase().trim())
                {

                    newFilterValue.push(splitVal[index]);
                }
            }

            filters[filterKey] = newFilterValue.join('|');

            var filterCheckboxes = $(".filter-checkboxes[data-filter-key='" + filterKey + "'] input");
            
            if (filterCheckboxes.length)
            {

                filterCheckboxes.each(function ()
                {

                    var $this = $(this);

                    if ($this.val().toLowerCase().trim() === filterValue.toLowerCase().trim())
                    {

                        $this.prop('checked', false);
                    }
                })
            }
        }

        reset_for_new_query(filters);
    });

    $body.on('click', '.filter-checkboxes .filter-title', function ()
    {

        var $this = $(this);

        var $parent = $this.closest('.filter-checkboxes');

        if ($parent.length)
        {

            $parent.toggleClass('open');
        }
    });

    $body.on('click', '.clear-filters', function ()
    {

        filters = {};

        var checkboxes = $('.filter-checkboxes input');

        if (checkboxes.length)
        {

            checkboxes.each(function () 
            {

                var $this = $(this);

                $this.prop('checked', false);
            });
        }

        var titleQuery = $('.filter-search-box');

        if (titleQuery.length)
        {

            titleQuery.val('');
        }

        reset_for_new_query(filters);
    });

    var filterSearchFunction = function ()
    {

        var $filterSearch = $('.filter-search-box');

        if ($filterSearch.length)
        {

            filters['title_query'] = ('' + $filterSearch.val()).trim();

            reset_for_new_query(filters);
        }
    };

    $body.on('click', '.more-button', append_for_current_query);

    $body.on('click', '.filter-button', function ()
    {

        var $this = $(this);

        var key = $this.attr('data-filter-key');

        var value = $this.attr('data-filter-value');

        if (key)
        {

            if ($this.attr('data-filters-reset'))
            {


                filters = {};
            }

            filters[key] = value;

            reset_for_new_query(filters);
        }
    });

    $body.on('click', '.filter-search-button', filterSearchFunction);

    $body.on('blur', '.filter-search-box', filterSearchFunction);

    $body.on('keyup', '.filter-search-box', function(e)
    {

        if (e.keyCode == 13) 
        {
            
            filterSearchFunction();
        }
    });

    $body.on('change', '.filter-select', function ()
    {

        var $this = $(this);

        var value = $this.val();

        var key = $this.attr('data-filter-key');

        filters[key] = value;

        reset_for_new_query(filters);
    });
    $body.on('change', '.filter-checkboxes input', function ()
    {

        var $this = $(this);

        var parent = $this.closest('.filter-checkboxes');

        var key = parent.attr('data-filter-key');

        var _value = [];

        var value = '';

        var boxes = parent.find('input');

        if (boxes.length)
        {

            boxes.each(function()
            {

                if (this.checked)
                {

                    var $this = $(this);

                    _value.push($this.val());
                }
            });

            value = _value.join('|');
        }

        filters[key] = value;

        reset_for_new_query(filters);
    });

    if (window.query_filters_object)
    {

        filters = window.query_filters_object;
        // Look at possibly only resetting the clear buttons.
        reset_for_new_query(filters);

        for (var i in window.query_filters_object)
        {

            var select_filters = $('.filter-select[data-filter-key="' + i + '"]');

            if (select_filters.length)
            {

                select_filters.val(window.query_filters_object[i]);
            }

            var value_split = window.query_filters_object[i].split('|');

            for (var j in value_split)
            {

                var filter_checkbox_query = '.filter-checkboxes[data-filter-key="' + i + '"] input[value="' + value_split[j] + '"]';

                // console.log(filter_checkbox_query);

                var filter_checkbox = $(filter_checkbox_query);

                if (filter_checkbox.length)
                {

                    filter_checkbox.prop('checked', true);
                }
            }
        }
    }

    var dateTexts = $('.tribe-event-schedule-details');

    if ((dateTexts || {}).length)
    {

        dateTexts.each(function ()
        {

            var $this = $(this);

            var text = $this.text();

            var textSplit = text.split('@');

            var dateText = ('' + textSplit[0]).trim();

            var timeText = ('' + textSplit[1]).trim();

            var dateNumber = dateText.split(' ')[1].replace(',', '');

            $this.html('' +
                '<div class="col-xs-4 icon-calendar">' +
                    dateNumber +
                '</div>' +
                '<div class="col-xs-8 date-time-display">' +
                    '<div class="col-xs-12 date-header">' +
                        dateText +
                    '</div>' +
                    '<div class="col-xs-12 date-text">' +
                        timeText + ' SHARP!' +
                    '</div>' +
                '</div>'
            );

        });
    }

    var venueDetails = $('.tribe-events-venue-details');

    if ((venueDetails || {}).length)
    {

        venueDetails.each(function ()
        {

            var $parent = $(this);

            var $map = $parent.find('.tribe-events-gmap');

            if (($map || {}).length)
            {

                $map.text('GET DIRECTIONS');

                var $container = $('<div class="directions-link col-xs-12 col-md-4"></div>');

                $container.append($map);



                var current_url = window.location.href;

                var location_name = $parent.clone().children().remove().end().text().trim();

                var variables = {

                    streetAddress: $parent.find('.tribe-street-address'),

                    city: $parent.find('.tribe-locality'),

                    region: $parent.find('.tribe-region'),

                    zip: $parent.find('tribe-postal-code'),

                    country: $parent.find('.tribe-country-name'),

                    time: $parent.closest('.author.location').find('.tribe-event-schedule-details .date-time-display')
                };

                var values = {};

                for (var i in variables)
                {

                    var $i = variables[i];

                    if ($i && $i.length)
                    {

                        values[i] = ('' + $i.text()).trim();
                    }

                    else
                    {

                        values[i] = '';
                    }
                }

                var url = encodeURI("mailto:?body=" + values['time'] + '\n' + location_name + '\n' + values.streetAddress + '\n' +
                    values.city + ', ' + values.region + ' ' + values.zip + '\n' + values.country + '\n\n' + current_url);

                $container.append($('<a class="social-share-icon email" href="' + url + '"></a>'));

                $container.insertAfter($parent);
            }
        });
    }

    function set_filters_for_list(filter_levels, filter_level, filter_key, data_values)
    {

        var filter_container = filter_levels[filter_level][filter_key];

        var filter_object = filter_container['filter_object'];

        var parent = null;

        if (filter_container['filter_parent_key'] && filter_levels[filter_level - 1])
        {

            parent = filter_levels[filter_level - 1][filter_container['filter_parent_key']];
        }

        var id_list = Object.keys(data_values);

        if (parent)
        {

            if (!parent.filtered_values)
            {

                set_filters_for_list(filter_levels, filter_level - 1, filter_container['filter_parent_key'], data_values);

                id_list = parent.filtered_values;
            }
        }

        var filtered_id_list = filter_container.filtered_values = [];

        var filter_key = filter_object['filter_key'];

        var filter_value = filter_object['filter_value'];

        if (typeof filter_value === 'string')
        {
	    var filterString = filter_value;
		filter_value = {};
	    var filter_value_key = filterString.trim().toLowerCase();
	    filter_value[filter_value_key] = true;
        }

        var is_neg = filter_object['is_neg'];

        var is_location = filter_object['is_location'];

        for (var pidid in id_list)
        {

            var pid = id_list[pidid];

            var post = data_values[pid];

            var valid = false;

            if (is_location)
            {

                if (post['locations'])
                {

                    for (var locationIndex in post['locations'])
                    {

                        var val = obj_get(post, ['locations', locationIndex, filter_key]);

                        // console.log(pid, post)
                        //
                        // console.log(val);

                        valid = filter_value[('' + val).trim().toLowerCase()];

                        if (valid)
                        {

                            break;
                        }
                    }
                }
            }

            else
            {

                var val = obj_get(post, filter_key);

                valid = filter_value[('' + val).trim().toLowerCase()];
            }

            if (valid && !is_neg || !valid && is_neg)
            {

                filtered_id_list.push(pid);
            }
        }
    }

    function obj_get(obj, keys, def)
    {

        if (typeof keys === 'string')
        {

            return obj[keys] || def;
        }

        else
        {

            var cur = obj;

            for (var keyIndex in keys)
            {

                if (cur)
                {

                    cur = obj_get(cur, keys[keyIndex]);
                }
            }

            if (!cur)
            {

                cur = def;
            }

            return cur;
        }
    }

    var postings_html = $body.find('.postings-container .posting');

    var postings_filter_html = $body.find('.postings-filter');

    var _job_posting_data = window.job_posting_data;

    if (postings_html.length && postings_filter_html.length && _job_posting_data && Object.keys(_job_posting_data).length)
    {

        var filter_levels = [];

        postings_filter_html.each(function ()
        {

            var $this = $(this);

            var filter_level = parseInt($this.attr('data-filter-level'));

            var filter_key = $this.attr('data-filter-key');

            var parent_filter_key = $this.attr('data-parent-filter-key');
            // TODO safety checks
            var filter_object = JSON.parse($this.attr('data-filter-object'));

            if (!filter_levels[filter_level])
            {

                filter_levels[filter_level] = {};
            }

            filter_levels[filter_level][filter_key] = {'element': $this, 'filter_object': filter_object};

            if (parent_filter_key)
            {

                filter_levels[filter_level][filter_key]['parent_filter_key'] = parent_filter_key;
            }
        });

        for (var levelIndex in filter_levels)
        {

            for (var filterKey in filter_levels[levelIndex])
            {

                var filterObj = filter_levels[levelIndex][filterKey];

                if (filterObj['parent_filter_key'] && filter_levels[levelIndex - 1])
                {

                    var filterParent = filter_levels[levelIndex - 1][filterObj['parent_filter_key']];

                    if (filterParent)
                    {

                        if (!filterParent['children'])
                        {

                            filterParent['children'] = [];
                        }

                        filterParent['children'].push(filterKey);
                    }
                }

                set_filters_for_list(filter_levels, levelIndex, filterKey, _job_posting_data);
            }
        }

        postings_filter_html.each(function ()
        {

            var $this = $(this);

            if (parseInt($this.attr('data-filter-level')) !== 0)
            {

                $this.addClass('hidden');
            }
        });

        $body.on('click', '.postings-filter', function ()
        {


            var $this = $(this);

            var pid = parseInt($this.attr('data-filter-level'));

            var key = $this.attr('data-filter-key');

            postings_filter_html.each(function ()
            {

                var $this = $(this);

                if (parseInt($this.attr('data-filter-level')) !== 0)
                {

                    $this.addClass('hidden');
                }

                else
                {

                    $this.addClass('minimized');
                }

                $this.removeClass('selected');
            });

            var posting = filter_levels[pid][key];

            posting['element'].removeClass('hidden');

            var parent_id = key;

            var parent_level = pid;

            var last_parent_id = "";

            while (parent_id)
            {

                var tempPosting = (filter_levels[parent_level] || {})[parent_id];

                if (tempPosting)
                {

                    tempPosting['element'].removeClass('hidden');

                    tempPosting['element'].addClass('selected');


                    if ((tempPosting['children'] || {}).length)
                    {


                        for (var i in tempPosting['children'])
                        {

                            filter_levels[parent_level + 1][tempPosting['children'][i]]['element'].removeClass('hidden');
                        }
                    }

                    last_parent_id = tempPosting['element'].attr('data-sidebar-id');

                    parent_id = tempPosting['parent_filter_key'];

                    parent_level--;
                }

                else
                {

                    break;
                }
            }

            console.log('parent-id', last_parent_id);

            if (last_parent_id)
            {

                var sidebar_items = $body.find('.job-sidebar-item');

                if (sidebar_items.length)
                {

                    sidebar_items.each(function ()
                    {

                        var $$this = $(this);

                        if ($$this.attr('data-sidebar-id') === last_parent_id)
                        {

                            $$this.removeClass('hidden');
                        }

                        else
                        {

                            $$this.addClass('hidden');
                        }
                    })
                }
            }

            postings_html.each(function ()
            {

                var $this = $(this);
// slow
                if (posting['filtered_values'].indexOf($this.attr('data-posting-id')) !== -1)
                {

                    $this.removeClass('hidden');
                }

                else
                {

                    $this.addClass('hidden');
                }
            });
        });

        var stateSelectionParam = getUrlParameter('stateSelection');

        if (stateSelectionParam)
        {

            var stateSelectionObj = $('.postings-filter[data-state-selection="' + stateSelectionParam + '"]');

            if (stateSelectionObj.length)
            {

                stateSelectionObj.trigger('click');
            }
        }
    }
};
// https://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

var temp_jQuery = window.$ || window.jQuery;

if (typeof temp_jQuery === 'function')
{

    temp_jQuery(document).ready(document_ready);
}

else
{

    var end_time = Date.now() + (1000 * 60 * 60);

    var attempt_document_ready = function()
    {

        var temp_jQuery = window.$ || window.jQuery;

        if (typeof temp_jQuery === 'function')
        {

            temp_jQuery(document).ready(document_ready);
        }

        else
        {

            if (Date.now() < end_time)
            {

                setTimeout(attempt_document_ready, 100);
            }

            else
            {

                console.error('Unable to access jquery in timeline');
            }
        }
    };

    setTimeout(attempt_document_ready, 100);
}

// var contactSales = document.querySelectorAll('.contact-sales-rep-button > a.label');
// for (var i = 0; i < contactSales; i++){
//     contactSales[i].addEventListener('click', modalInit);
// }

// function modalInit(){
//     var modal = document.getElementById("modal");
//     var btn = document.querySelectorAll('.contact-sales-rep-button')[0];
//     var span = document.getElementsByClassName("close")[0];
//     var body = document.getElementsByTagName("BODY")[0];
//     btn.onclick = function() {
//       modal.style.display = "block";  
//       body.appendChild(modal);
//     }
//     span.onclick = function() {
//       modal.style.display = "none";
//     }
//     window.onclick = function(event) {
//       if (event.target == modal) {
//         modal.style.display = "none";
//       }
//     }
//   }
