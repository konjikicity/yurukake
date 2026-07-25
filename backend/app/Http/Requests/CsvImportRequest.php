<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CsvImportRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'file' => 'required|file|mimetypes:text/plain,text/csv,application/csv,application/vnd.ms-excel|max:512',
            'mode' => 'nullable|in:append,replace',
            'on_duplicate' => 'nullable|in:skip,import',
            'create_categories' => 'nullable|boolean',
            'dry_run' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'file.max' => 'ファイルが大きすぎます（512KBまで）',
            'file.mimetypes' => 'CSVファイルを選んでください',
        ];
    }
}
