<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Auth\Middleware\Authenticate;
use App\Http\Controllers\ConfigController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::middleware(['auth', 'maintenance'])->group(function () {
Route::get('/', 'IndexController@show')->name('index')->withoutMiddleware('auth');
Route::get('/?error=invalidcreds', 'IndexController@show')->name('idxinvalid')->withoutMiddleware('auth');
Route::post('/', 'IndexController@login')->name('login')->withoutMiddleware('auth');

Route::get('/me', 'MeController@show')->name('me');


});

Route::get('/maintenance', function() {
	return  view('maintenance', ['config' => ConfigController::getConfig()]);
	})->name('maintenance');

Route::post('/maintenance', 'IndexController@login');
Route::get('/maintenance?error=invalidcreds', function() {
	return  view('maintenance', ['config' => ConfigController::getConfig()]);
	})->name('maintenanceinvalid');
Route::get('/maintenance?error=invalidfields', function() {
	return  view('maintenance', ['config' => ConfigController::getConfig()]);
	})->name('maintenanceinv2');
Route::get('/disconnect', 'IndexController@logout');