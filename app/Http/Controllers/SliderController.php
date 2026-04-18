<?php
namespace App\Http\Controllers;

use App\Models\Slider;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Sliders/Index', [
            'sliders' => Slider::orderBy('ordre')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'sous_titre' => 'nullable|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'ordre' => 'nullable|integer',
        ]);

        $path = $request->file('image')->store('sliders', 'public');

        Slider::create([
            'titre' => $request->titre,
            'sous_titre' => $request->sous_titre,
            'image_path' => $path,
            'ordre' => $request->ordre ?? 0,
            'est_actif' => true,
        ]);

        return redirect()->route('admin.sliders.index')->with('success', 'Slide ajouté !');
    }

    public function destroy(Slider $slider)
    {
        Storage::disk('public')->delete($slider->image_path);
        $slider->delete();
        return back();
    }
}