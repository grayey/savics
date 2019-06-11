declare const $: any;


export const run = (tableTitle = '') => {
    $(document).ready(() => {
        $('#datatable').DataTable();

        const table = $('#data_table').DataTable({
            lengthChange: false,
            buttons: ['colvis',
                {
                    extend: 'excel',
                    title: () => {
                        return `Metrock_${tableTitle.toLowerCase()}`;
                    }
                },
                {
                    extend: 'print',
                    title: () => {
                        return `Metrock ${tableTitle}`;
                    }
                }
            ],
        });

        table.buttons().container()
            .appendTo('#datatable-buttons_wrapper .col-md-6:eq(0)');
    });
};


export const triggerModalOrOverlay = (action: string, modalId: string) => {

    (action === 'open') ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
    // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
    // });

}

// export const jQuery(document).ready(()=> {
//   TableData.init()
// })


