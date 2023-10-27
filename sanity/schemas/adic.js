export default {
    name: 'adic',
    title: "Adicionais",
    type: "document",
    fields: [
        {
            name: 'image',
            tittle: 'image',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'name',
            tittle: 'name',
            type: 'string'
        },
        {
            name: 'slug',
            tittle: 'slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLenght: '90'
            }
        },
        {
            name: 'price',
            tittle: 'price',
            type: 'array',
            of: [{ type: 'number' }]
        },
        {
            name: 'details',
            tittle: 'details',
            type: 'string'
        }, 
        {
            name: 'id',
            tittle: 'Id',
            type: 'number'
        }

    ]
}