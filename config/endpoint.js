const config = {  
	icfs_inquiry:
	{
		url: '192.168.0.90',
		protocol: 'http',
    port: '8090',
    path: '/icfs/inquiry'
	},
	mapp_inquiry:
	{
		url: '192.168.0.89',
		protocol: 'http',
    port: '8089',
    path: '/mapp/inquiry'
	},
	api_validator:
	{
		url: '192.168.0.80',
		protocol: 'http',
    port: '8080',
    path: ''
	},
	api_lookup:
	{
		url: '192.168.0.81',
		protocol: 'http',
    port: '8081',
    path: ''
	},
	api_mcard_inquiry:
	{
		url: '192.168.0.82',
		protocol: 'http',
    port: '8082',
    path: ''
	},
	api_mcard_command:
	{
		url: '192.168.0.83',
		protocol: 'http',
    port: '8083',
    path: ''
	},
	api_partner_inquiry:
	{
		url: '192.168.0.87',
		protocol: 'http',
    port: '8087',
    path: ''
	},
	client_cobrand_inquiry:
	{
		url: '192.168.0.84',
		protocol: 'http',
    port: '8084',
    path: ''
	},
	client_cobrand_redeem:
	{
		url: '192.168.0.85',
		protocol: 'http',
    port: '8085',
    path: ''
	},
	client_cobrand_command:
	{
		url: '192.168.0.86',
		protocol: 'http',
    port: '8086',
    path: ''
	}
};
module.exports = config;