$(function () {
    $("#wrapper").toggleClass("toggled");
    function capi(data) {
        return data.charAt(0).toUpperCase() + data.slice(1).replace(/_/g, " ");
    }
    (function tableList() {$.get('/tableList', function (data) {
        $('.tableList').append("<li class='sidebar-brand'><a href=''>DVD Rental /<small> Description</small></a></li>");
            data.rows.forEach(function (item) {
                $('.tableList').append("<li id='" + item.table_name + "'><a href=''>" +  capi(item.table_name));
            })
        })
    }());
    $('#next').hide();
    $('.searchTableDiv').hide();
    var countRows;
    $('#next').on('click', function (event) {           /*      Next Button         */
        event.preventDefault();
        $('#offsetRows').val(+$('#offsetRows').val() + 12);
        var rest = countRows - (+$('#offsetRows').val()) < 12;
        if(rest){
            $('#offsetRows').val(+$('#offsetRows').val() + rest);
            $('#form1').submit();
            return
        }
        $('#form1').submit();
    });                                                 /*      -/#next-button-       */
    function clearTable(){
        $('.thead, .tbody').html("");
    }
    function clear() {
        $('#nextRows, #searchTable').val("");
    }
    $('.profile').on('click', function () {
       $('.resume').toggleClass('hidden');
        clearTable();
    });
    $('.tableList').on('click','a', function (event) {      /*      Table List      */
        event.preventDefault();
        if ($(this).parent('li').attr('class') === "sidebar-brand"){
            $('.description').removeClass('hidden');
            clearTable();
            return
        }else{
            $('.description, .resume').addClass('hidden')
        }
        clearTable();
        clear();
        $('#formation').html("");
        $('#next').prop("disabled", false);
        $('#offsetRows').val(0);
        $('#search').val($(this).parent('li').attr('id'));
        $('#form2').submit();
        $('#search').val(capi($(this).parent('li').attr('id')));
        var resize = $(window).width();
        if (resize < 1000){
            $("#wrapper").toggleClass("toggled");
        }
    });                                                     /*      -/#table-list-      */
    var id;
    function forms() {                                  /*      Function Forms      */
         return function (data) {
             $('.title').text(capi($('#search').val()));
             $('#next').show();
             $('.searchTableDiv').show();
             $('.loading').html("");
             var  count3 = 1;
             data.fields.forEach(function (item) {
                 if (count3 == data.fields.length){
                     $('.thead').append("<th >Edit");
                     id = data.fields[data.fields.length -1].name
                 }else {
                     $('.thead').append("<th style='cursor: pointer;' class='order' data-target='" + item.name + "'>" + capi(item.name) + "</th>");
                 }
                 count3++;
             });
             var count = 0;
             data.rows.forEach(function (item) {
                 var count2= 1;
                 $('.tbody').append("<tr class='" + count + "'>");
                 Object.keys(item).forEach(function(key) {
                     if(count2 == Object.keys(item).length){
                         $('.'+ count).append("<td style='width: 3%'><button type='button' data-toggle='modal' data-target='#editModal' id='edit' data-item='" + item[key] + "' class='btn btn-primary btn-xs' style='margin-left: 3%'><span class='glyphicon glyphicon-pencil'></span></button></td>")
                     }else {
                         $('.'+ count).append("<td id='edit' data-target='" + key + "'>" + item[key] + "</td>")
                     }
                     count2++
                 });
                 count++
             });
             if ($('.tbody').children().length < 12){
                 $('#next').prop("disabled", true);
             }
         };                                                   /*      -/#function-forms-    */
     }
    $('#form1').on('submit', function (event) {             /*      Column Submit Form 1      */
        event.preventDefault();
        clearTable();
        $('.loading').html("<div class='loadingDiv'>Loading...");
        var form = $(this);
        if($('#searchTable').val() === ""){
            $('#next').prop("disabled", false);
            $.ajax({ type: 'GET', url: '/columnResult', data: form.serialize()
            }).done(forms())
        }else {
            $.ajax({ type: 'GET', url: '/searchTable', data: form.serialize()
            }).done(forms())}                               /*      -/#column-submit-form-1-      */
    });
    $('#form2').on('submit', function (event) {             /*      Table Submit Form 2      */
        event.preventDefault();
        var form = $(this);
        $.ajax({ type: 'GET', url: '/tableResult', data: form.serialize()
        }).done(function (data) {
           countRows = data.rows.length;
            if (countRows < 12){
                $('#offsetRows').val(0);
                $('#nextRows').val(countRows);
            }else {
                $('#nextRows').val(12)
            }
            $('#orderColumn').val(data.fields[0].name);
            $('#ascDesc').val("asc");
            $('#form1').submit()
        });                                                  /*      -/#table-submit-form-2      -*/
    });
    var debounce = function(func, wait, immediate) {        /*      Debounce        */
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            if (immediate && !timeout) {
                func.apply(context, args);
            }
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };                                                  /*      -/#debounce-        */
    };
    $('#searchTable').keyup( debounce(function (event) {        /*      Search in Table      */
        event.preventDefault();
        if ($('.tbody').children().length <= 12){
            $('#next').prop('disabled', false)
        }
        $('#form1').submit() ;                                   /*      -/#search-in-table-      */
    },500));
    $('.thead').on('click','.order', function (event) {         /*      Order By        */
        event.preventDefault();
        if ($('#searchTable').val() === "") {$('.loading').html("<div class='loadingDiv'>Loading...");}
        $('#orderColumn').val($(this).attr('data-target'));
        if ($('#ascDesc').val() == "asc") {
            $('#ascDesc').val('desc');
            $('#form1').submit();
        } else {
            $('#ascDesc').val('asc');
            $('#form1').submit();
        }                                                       /*      -/#order-by-        */
    });
    function removeColumn(tableName) {
        if (tableName === "Actor")return ["title"];
        else if (tableName === "Address")return ["city"];
        else if (tableName === "Category")return ["title"];
        else if (tableName === "City")return ["country"];
        else if (tableName === "Country")return [];
        else if (tableName === "Customer")return ["address", "district"];
        else if (tableName === "Film")return ["language"];
        else if (tableName === "Payment")return ["staff_name", "customer_name", "rental_date", "return_date"];
        else if (tableName === "Rental")return ["title", "customer_name", "staff_name"];
        else if (tableName === "Staff")return ["address"];
    }
    $('.tbody').on('click','#edit', function (event) {          /*      Edit Button         */
        event.preventDefault();
        $('.btn-secondary, .formationBtn, .modal-title, .close').show();
        $('#formation').html("");
        var table = $(this).closest("tr");
        $('.modal-title').text($('#search').val());
        $('#formation').append("<input hidden type='text' name='" + id + "' value='" + id + " = " + $(this).attr('data-item') + "'><input hidden type='submit'>");
        var currentTable = $('#search').val();
        table.children('td:not(:last-child)').prev('td').map(function () {
            if ($.inArray($(this).attr('data-target'), removeColumn(currentTable)) > - 1){
                    return false
            }else
            $('#formation').append("<div class='form-group'><label class='control-label'>" + capi($(this).attr('data-target')) + "</label>" +
                "<input minlength='2' class='form-control' type='text' name='" + $(this).attr('data-target') + "' value='" + $(this).text() + "' autocomplete='off' required/><div class='help-block with-errors'></div></div>");
        });
    });                                                     /*      -/#edit-button      */
    $('.formationBtn').on('click', function () {            /*      Submit After Edit Button    */
        $('#formation').submit();
    });                                                     /*      -/#submit-after-edit-button    */
    $('#formation').on('submit', function (event) {         /*      Edit Submit Form        */
        if (!event.target.checkValidity()) {
            event.preventDefault();
            $('#formation :input:visible[required="required"]').each(function () {
                if (!this.validity.valid) {
                    $(this).focus().prev('label').addClass('prevLabel');
                    $(this).attr("placeholder", this.validationMessage).addClass('placeholderError');
                    $(this).val('');
                    return false;
                }else {$(this).prev('label').removeClass('prevLabel')}
            });
            return;
        }
        event.preventDefault();
        var $form = $(this);
        $.ajax({type: 'POST', url: '/update', data: $form.serialize()
        }).done(function (data) {
            $('#formation').trigger('reset');
            $('.btn-secondary, .formationBtn, .modal-title, .close').hide();
            $('#formation').html("<h3 style='text-align: center'>Successfully Added</h3>");
            setTimeout(function () {
                $('.btn-secondary').click();
                $('#form1').submit()
            },800);
        });
    });
});                                                          /*     -/#edit-submit-form-        */