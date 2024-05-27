$(document).ready(function () {

    // Populate the brand dropdown on document ready
    $.get('http://localhost:3000/restaurants', function (data) {
        data.forEach(function (brand) {
            $('#brand-dropdown').append(new Option(brand, brand));
        });
    });

    // Populate the location dropdown on document ready
    $.get('http://localhost:3000/locations', function (data) {
        data.forEach(function (location) {
            $('#location-dropdown').append(new Option(location, location));
        });
    });

    // When a brand is selected, update the locations dropdown
    $('#brand-dropdown').change(function () {
        if ($('#location-dropdown').val()) {
            return;
        }
        var brandId = $(this).val();
        if (brandId) reset();
        $('#location-dropdown').empty().append(new Option('Select a location', ''));
        $.get('http://localhost:3000/locations?brand=' + brandId, function (data) {
            data.forEach(function (location) {
                $('#location-dropdown').append(new Option(location, location));
            });
        });
    });

    // When a location is selected, update the brands dropdown
    $('#location-dropdown').change(function () {
        if ($('#brand-dropdown').val()) {
            return;
        }
        var locationId = $(this).val();
        if (locationId) reset();
        $('#brand-dropdown').empty().append(new Option('Select a brand', ''));
        $.get('http://localhost:3000/restaurants?location=' + locationId, function (data) {
            data.forEach(function (brand) {
                $('#brand-dropdown').append(new Option(brand, brand));
            });
        });
    });

    // We enable the submit button only when both a brand and a location are selected
    $('#brand-dropdown, #location-dropdown').change(function () {
        if ($('#brand-dropdown').val() && $('#location-dropdown').val()) {
        } else {
        }
    });

    $('#submit-button').click(function () {
        var brandId = $('#brand-dropdown').val();
        var locationId = $('#location-dropdown').val();

        reset();

        // Check if both dropdowns have a value selected
        if (!brandId || !locationId) {
            // If a dropdown does not have a value selected, add a red border to it
            if (!brandId) {
                $('#brand-dropdown').css('border', '1px solid red');
            }
            if (!locationId) {
                $('#location-dropdown').css('border', '1px solid red');
            }
            // Exit the function early
            return;
        }

        // Update the title
        var brandText = $('#brand-dropdown option:selected').text();
        var locationText = $('#location-dropdown option:selected').text();
        $('#items').text('Unavailable Items for "' + brandText + '" in "' + locationText + '"');

        $.get('http://localhost:3000/unavailable-items?brand=' + brandId + '&location=' + locationId, function (data) {
            $('#unavailable-items').empty();
            data.forEach(function (item) {
                $('#unavailable-items').append('<div class="item"><h2>' + item.name + '</h2><p>' + item.reason + '</p></div>');
            });
        });

        // Reset the dropdowns
        $('#brand-dropdown').val('');
        $('#location-dropdown').val('');

        $('#brand-dropdown').trigger('change');
        $('#location-dropdown').trigger('change');
    });

    $('#clear-button').click(function () {
        $('#brand-dropdown').val('');
        $('#location-dropdown').val('');

        $('#brand-dropdown').trigger('change');
        $('#location-dropdown').trigger('change');

        reset();
    });

    $('#filter').on('input', function () {
        var filterValue = $(this).val().toLowerCase();

        $('.item').each(function () {
            var itemName = $(this).find('h2').text().toLowerCase();
            var itemReason = $(this).find('p').text().toLowerCase();

            if (itemName.includes(filterValue) || itemReason.includes(filterValue)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});

function reset() {
    // Clear the unavailable items
    $('#items').text('Unavailable Items');
    $('#filter').val('');
    $('#unavailable-items').empty();

    // Remove previous error styles
    $('#brand-dropdown, #location-dropdown').css('border', '1px solid #ddd');
}